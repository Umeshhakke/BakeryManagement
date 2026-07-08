from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import api_view
from django.db.models import Sum
from rest_framework.exceptions import ValidationError
from .models import (
    RawMaterial, Shop, FinishedGoods, ProductionBatch, 
    ProductionConsumption, Sales, ReplenishmentRequest, ShopInventory, Delivery,
    RawMaterialMovement, FinishedGoodsMovement  # <-- Added these imports
)
from .serializers import (
    RawMaterialSerializer, ShopSerializer, FinishedGoodsSerializer,
    ProductionBatchSerializer, SalesSerializer, 
    ReplenishmentRequestSerializer, ShopInventorySerializer,
    RawMaterialMovementSerializer, FinishedGoodsMovementSerializer,DeliverySerializer
)

# --- Standard ViewSets ---

class RawMaterialViewSet(viewsets.ModelViewSet):
    queryset = RawMaterial.objects.all()
    serializer_class = RawMaterialSerializer

class ShopViewSet(viewsets.ModelViewSet):
    queryset = Shop.objects.all()
    serializer_class = ShopSerializer

class FinishedGoodsViewSet(viewsets.ModelViewSet):
    queryset = FinishedGoods.objects.all()
    serializer_class = FinishedGoodsSerializer

class ProductionBatchViewSet(viewsets.ModelViewSet):
    queryset = ProductionBatch.objects.all().order_by('-batch_date')
    serializer_class = ProductionBatchSerializer

    def create(self, request, *args, **kwargs):
        data = request.data
        batch_serializer = self.get_serializer(data=data)
        batch_serializer.is_valid(raise_exception=True)
        batch = batch_serializer.save()
        
        if 'consumptions' in data and isinstance(data['consumptions'], list):
            for consumption_data in data['consumptions']:
                ProductionConsumption.objects.create(
                    batch=batch,
                    raw_material_id=consumption_data['raw_material'],
                    quantity_used=consumption_data['quantity_used']
                )
        
        headers = self.get_success_headers(batch_serializer.data)
        return Response(batch_serializer.data, status=status.HTTP_201_CREATED, headers=headers)

class SalesViewSet(viewsets.ModelViewSet):
    queryset = Sales.objects.all().order_by('-sale_date')
    serializer_class = SalesSerializer

    def get_queryset(self):
        queryset = super().get_queryset()
        shop_id = self.request.query_params.get('shop')
        if shop_id:
            queryset = queryset.filter(shop_id=shop_id)
        return queryset

class ReplenishmentRequestViewSet(viewsets.ModelViewSet):
    queryset = ReplenishmentRequest.objects.all().order_by('-request_date')
    serializer_class = ReplenishmentRequestSerializer

    def get_queryset(self):
        queryset = super().get_queryset()
        status_filter = self.request.query_params.get('status')
        if status_filter:
            queryset = queryset.filter(status=status_filter)
        return queryset

    # NEW: Validate stock before creating a request
    def create(self, request, *args, **kwargs):
        product_id = request.data.get('product')
        requested_qty = int(request.data.get('requested_quantity', 0))
        
        if product_id and requested_qty > 0:
            try:
                product = FinishedGoods.objects.get(id=product_id)
                if product.current_warehouse_stock < requested_qty:
                    raise ValidationError({
                        "detail": f"Insufficient stock. Only {product.current_warehouse_stock} units available."
                    })
            except FinishedGoods.DoesNotExist:
                pass
        
        return super().create(request, *args, **kwargs)
   
class ShopInventoryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = ShopInventory.objects.all()
    serializer_class = ShopInventorySerializer

    def get_queryset(self):
        queryset = super().get_queryset()
        shop_id = self.request.query_params.get('shop')
        if shop_id:
            queryset = queryset.filter(shop_id=shop_id)
        return queryset

# --- NEW: Movement ViewSets (for warehouse & production logging) ---
class RawMaterialMovementViewSet(viewsets.ModelViewSet):
    queryset = RawMaterialMovement.objects.all().order_by('-timestamp')
    serializer_class = RawMaterialMovementSerializer

class FinishedGoodsMovementViewSet(viewsets.ModelViewSet):
    queryset = FinishedGoodsMovement.objects.all().order_by('-timestamp')
    serializer_class = FinishedGoodsMovementSerializer

# --- Analytics API endpoints ---
@api_view(['GET'])
def total_sales_by_product(request):
    data = Sales.objects.values('product__product_name').annotate(total=Sum('quantity_sold'))
    return Response(data)

@api_view(['GET'])
def shop_performance(request):
    data = Sales.objects.values('shop__name').annotate(total=Sum('quantity_sold'))
    return Response(data)

@api_view(['GET'])
def sales_over_time(request):
    data = Sales.objects.values('sale_date__date').annotate(total=Sum('quantity_sold')).order_by('sale_date__date')
    return Response(data)

@api_view(['GET'])
def raw_material_usage(request):
    data = ProductionConsumption.objects.values('raw_material__name').annotate(total=Sum('quantity_used'))
    return Response(data)

@api_view(['GET'])
def product_distribution(request):
    """Returns detailed production, delivery, sales, and stock data for a specific product."""
    product_id = request.query_params.get('product_id')
    if not product_id:
        return Response({"error": "product_id parameter is required"})
    
    try:
        product = FinishedGoods.objects.get(id=product_id)
    except FinishedGoods.DoesNotExist:
        return Response({"error": "Product not found"})

    # 1. Total produced (sum of all batches)
    total_produced = ProductionBatch.objects.filter(product_name=product.product_name).aggregate(total=Sum('quantity_produced'))['total'] or 0

    # 2. Deliveries grouped by shop
    deliveries = Delivery.objects.filter(product=product).values('shop__id', 'shop__name').annotate(total=Sum('quantity'))

    # 3. Sales grouped by shop
    sales = Sales.objects.filter(product=product).values('shop__id', 'shop__name').annotate(total=Sum('quantity_sold'))

    # 4. Current Shop Inventory
    shop_inventory = {si.shop_id: si.current_stock for si in ShopInventory.objects.filter(product=product)}

    # Combine all shop data
    shops_data = []
    for d in deliveries:
        shop_id = d['shop__id']
        shop_name = d['shop__name']
        total_sold = next((s['total'] for s in sales if s['shop__id'] == shop_id), 0)
        current_stock = shop_inventory.get(shop_id, 0)
        shops_data.append({
            'shop_id': shop_id,
            'shop_name': shop_name,
            'total_delivered': d['total'],
            'total_sold': total_sold,
            'current_shop_stock': current_stock
        })

    # (Handle rare case: a shop sold it without a delivery record, e.g., initial setup)
    for s in sales:
        if not any(d['shop_id'] == s['shop__id'] for d in shops_data):
            shops_data.append({
                'shop_id': s['shop__id'],
                'shop_name': s['shop__name'],
                'total_delivered': 0,
                'total_sold': s['total'],
                'current_shop_stock': shop_inventory.get(s['shop__id'], 0)
            })

    return Response({
        'product_name': product.product_name,
        'total_produced': total_produced,
        'current_warehouse_stock': product.current_warehouse_stock,
        'shops': shops_data
    })

@api_view(['GET'])
def product_summary(request):
    """Returns summary for all products: total produced, delivered, sold, warehouse stock."""
    products = FinishedGoods.objects.all()
    summary = []
    for product in products:
        total_produced = ProductionBatch.objects.filter(product_name=product.product_name).aggregate(total=Sum('quantity_produced'))['total'] or 0
        total_delivered = Delivery.objects.filter(product=product).aggregate(total=Sum('quantity'))['total'] or 0
        total_sold = Sales.objects.filter(product=product).aggregate(total=Sum('quantity_sold'))['total'] or 0
        summary.append({
            'product_id': product.id,
            'product_name': product.product_name,
            'total_produced': total_produced,
            'total_delivered': total_delivered,
            'total_sold': total_sold,
            'current_warehouse_stock': product.current_warehouse_stock,
        })
    return Response(summary)

class DeliveryViewSet(viewsets.ModelViewSet):
    queryset = Delivery.objects.all().order_by('-delivery_date')
    serializer_class = DeliverySerializer
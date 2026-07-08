from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    RawMaterialViewSet, ShopViewSet, FinishedGoodsViewSet,
    ProductionBatchViewSet, SalesViewSet, ReplenishmentRequestViewSet,
    ShopInventoryViewSet, RawMaterialMovementViewSet, FinishedGoodsMovementViewSet,
    DeliveryViewSet,  # <--- ADD THIS IMPORT
    total_sales_by_product, shop_performance, sales_over_time, raw_material_usage,
    product_distribution, product_summary
)

router = DefaultRouter()
router.register(r'materials', RawMaterialViewSet)
router.register(r'shops', ShopViewSet)
router.register(r'finished-goods', FinishedGoodsViewSet)
router.register(r'production-batches', ProductionBatchViewSet)
router.register(r'sales', SalesViewSet)
router.register(r'replenishment-requests', ReplenishmentRequestViewSet)
router.register(r'shop-inventory', ShopInventoryViewSet)
router.register(r'material-movements', RawMaterialMovementViewSet)
router.register(r'finished-goods-movements', FinishedGoodsMovementViewSet)
router.register(r'deliveries', DeliveryViewSet)  # <--- ADD THIS LINE

urlpatterns = [
    path('', include(router.urls)),
    
    # Analytics endpoints
    path('analytics/total-sales/', total_sales_by_product, name='total-sales'),
    path('analytics/shop-performance/', shop_performance, name='shop-performance'),
    path('analytics/sales-over-time/', sales_over_time, name='sales-over-time'),
    path('analytics/raw-material-usage/', raw_material_usage, name='raw-material-usage'),
    path('analytics/product-summary/', product_summary, name='product-summary'),
    path('analytics/product-distribution/', product_distribution, name='product-distribution'),
]
from rest_framework import serializers
from .models import (
    RawMaterial, RawMaterialMovement, ProductionBatch, ProductionConsumption,
    FinishedGoods, FinishedGoodsMovement, Shop, ShopInventory, Delivery, Sales, ReplenishmentRequest
)

class RawMaterialSerializer(serializers.ModelSerializer):
    class Meta:
        model = RawMaterial
        fields = '__all__'

class ShopSerializer(serializers.ModelSerializer):
    class Meta:
        model = Shop
        fields = '__all__'

class FinishedGoodsSerializer(serializers.ModelSerializer):
    class Meta:
        model = FinishedGoods
        fields = '__all__'

class ProductionConsumptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductionConsumption
        fields = '__all__'

class ProductionBatchSerializer(serializers.ModelSerializer):
    consumptions = ProductionConsumptionSerializer(many=True, read_only=True)

    class Meta:
        model = ProductionBatch
        fields = '__all__'

class SalesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Sales
        fields = '__all__'

class ReplenishmentRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = ReplenishmentRequest
        fields = '__all__'

class ShopInventorySerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source='product.product_name', read_only=True)
    
    class Meta:
        model = ShopInventory
        fields = ['id', 'shop', 'product', 'product_name', 'current_stock']

class RawMaterialMovementSerializer(serializers.ModelSerializer):
    class Meta:
        model = RawMaterialMovement
        fields = '__all__'

class FinishedGoodsMovementSerializer(serializers.ModelSerializer):
    class Meta:
        model = FinishedGoodsMovement
        fields = '__all__'

class DeliverySerializer(serializers.ModelSerializer):
    class Meta:
        model = Delivery
        fields = '__all__'
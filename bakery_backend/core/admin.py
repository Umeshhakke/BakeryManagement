from django.contrib import admin
from .models import (
    RawMaterial, RawMaterialMovement, ProductionBatch, ProductionConsumption,
    FinishedGoods, FinishedGoodsMovement, Shop, ShopInventory, Delivery, Sales, ReplenishmentRequest
)

@admin.register(RawMaterial)
class RawMaterialAdmin(admin.ModelAdmin): pass

@admin.register(RawMaterialMovement)
class RawMaterialMovementAdmin(admin.ModelAdmin): pass

@admin.register(ProductionBatch)
class ProductionBatchAdmin(admin.ModelAdmin): pass

@admin.register(ProductionConsumption)
class ProductionConsumptionAdmin(admin.ModelAdmin): pass

@admin.register(FinishedGoods)
class FinishedGoodsAdmin(admin.ModelAdmin): pass

@admin.register(FinishedGoodsMovement)
class FinishedGoodsMovementAdmin(admin.ModelAdmin): pass

@admin.register(Shop)
class ShopAdmin(admin.ModelAdmin): pass

@admin.register(ShopInventory)
class ShopInventoryAdmin(admin.ModelAdmin): pass

@admin.register(Delivery)
class DeliveryAdmin(admin.ModelAdmin): pass

@admin.register(Sales)
class SalesAdmin(admin.ModelAdmin): pass

@admin.register(ReplenishmentRequest)
class ReplenishmentRequestAdmin(admin.ModelAdmin): pass
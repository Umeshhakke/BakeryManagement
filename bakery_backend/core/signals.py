from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import (
    RawMaterial, RawMaterialMovement, 
    FinishedGoods, FinishedGoodsMovement, 
    ShopInventory, Delivery, Sales, ProductionBatch
)

# --- 1. Auto-update Raw Material Stock when a Movement is logged ---
@receiver(post_save, sender=RawMaterialMovement)
def update_raw_material_stock(sender, instance, created, **kwargs):
    if created:
        material = instance.material
        if instance.movement_type == 'IN':
            material.current_quantity += instance.quantity_change
        elif instance.movement_type == 'OUT':
            material.current_quantity -= instance.quantity_change
        material.save()

# --- 2. Auto-update Finished Goods Stock when a Production Batch is created ---
@receiver(post_save, sender=ProductionBatch)
def add_finished_goods_from_production(sender, instance, created, **kwargs):
    if created:
        # Check if this product already exists in FinishedGoods, create if not
        product, created_status = FinishedGoods.objects.get_or_create(
            product_name=instance.product_name
        )
        # Add the produced quantity to warehouse stock
        product.current_warehouse_stock += instance.quantity_produced
        product.save()
        
        # Log the movement (for traceability)
        FinishedGoodsMovement.objects.create(
            product=product,
            quantity_change=instance.quantity_produced,
            movement_type='PROD',
            reference_id=f"Batch ID: {instance.id}"
        )

# --- 3. Auto-update Warehouse and Shop Stock when a Delivery is made ---
@receiver(post_save, sender=Delivery)
def process_delivery(sender, instance, created, **kwargs):
    if created:
        # Reduce Warehouse Stock
        warehouse_item = instance.product
        warehouse_item.current_warehouse_stock -= instance.quantity
        warehouse_item.save()

        # Log the warehouse movement
        FinishedGoodsMovement.objects.create(
            product=warehouse_item,
            quantity_change= -instance.quantity,
            movement_type='DEL',
            reference_id=f"Delivery ID: {instance.id}"
        )

        # Add stock to the Shop
        shop_inv, created_status = ShopInventory.objects.get_or_create(
            shop=instance.shop,
            product=instance.product
        )
        shop_inv.current_stock += instance.quantity
        shop_inv.save()

# --- 4. Auto-reduce Shop Stock when a Sale is made ---
@receiver(post_save, sender=Sales)
def reduce_shop_inventory(sender, instance, created, **kwargs):
    if created:
        shop_inv = ShopInventory.objects.get(
            shop=instance.shop,
            product=instance.product
        )
        shop_inv.current_stock -= instance.quantity_sold
        shop_inv.save()
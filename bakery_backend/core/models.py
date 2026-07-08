from django.db import models

class RawMaterial(models.Model):
    name = models.CharField(max_length=100)
    unit = models.CharField(max_length=20)  # kg, liters, pcs
    current_quantity = models.DecimalField(max_digits=10, decimal_places=2, default=0)

    def __str__(self):
        return self.name

class RawMaterialMovement(models.Model):
    MOVEMENT_TYPES = [
        ('IN', 'Purchase/Inbound'),
        ('OUT', 'Production/Outbound')
    ]
    material = models.ForeignKey(RawMaterial, on_delete=models.CASCADE)
    quantity_change = models.DecimalField(max_digits=10, decimal_places=2)
    movement_type = models.CharField(max_length=3, choices=MOVEMENT_TYPES)
    timestamp = models.DateTimeField(auto_now_add=True)
    notes = models.TextField(blank=True)

class ProductionBatch(models.Model):
    batch_date = models.DateTimeField(auto_now_add=True)
    product_name = models.CharField(max_length=100)
    quantity_produced = models.IntegerField()
    notes = models.TextField(blank=True)

    def __str__(self):
        return f"{self.product_name} - {self.batch_date.strftime('%Y-%m-%d')}"

class ProductionConsumption(models.Model):
    batch = models.ForeignKey(ProductionBatch, on_delete=models.CASCADE)
    raw_material = models.ForeignKey(RawMaterial, on_delete=models.CASCADE)
    quantity_used = models.DecimalField(max_digits=10, decimal_places=2)

class FinishedGoods(models.Model):
    product_name = models.CharField(max_length=100)
    current_warehouse_stock = models.IntegerField(default=0)

    def __str__(self):
        return self.product_name

class FinishedGoodsMovement(models.Model):
    MOVEMENT_TYPES = [
        ('PROD', 'Production In'),
        ('DEL', 'Delivered to Shop')
    ]
    product = models.ForeignKey(FinishedGoods, on_delete=models.CASCADE)
    quantity_change = models.IntegerField()
    movement_type = models.CharField(max_length=4, choices=MOVEMENT_TYPES)
    timestamp = models.DateTimeField(auto_now_add=True)
    reference_id = models.CharField(max_length=50, blank=True) # e.g., Batch ID or Delivery ID

class Shop(models.Model):
    name = models.CharField(max_length=100)
    location = models.CharField(max_length=200)
    contact = models.CharField(max_length=20)

    def __str__(self):
        return self.name

class ShopInventory(models.Model):
    shop = models.ForeignKey(Shop, on_delete=models.CASCADE)
    product = models.ForeignKey(FinishedGoods, on_delete=models.CASCADE)
    current_stock = models.IntegerField(default=0)

    class Meta:
        unique_together = ('shop', 'product')

class Delivery(models.Model):
    shop = models.ForeignKey(Shop, on_delete=models.CASCADE)
    product = models.ForeignKey(FinishedGoods, on_delete=models.CASCADE)
    quantity = models.IntegerField()
    delivery_date = models.DateTimeField(auto_now_add=True)

class Sales(models.Model):
    shop = models.ForeignKey(Shop, on_delete=models.CASCADE)
    product = models.ForeignKey(FinishedGoods, on_delete=models.CASCADE)
    quantity_sold = models.IntegerField()
    sale_date = models.DateTimeField(auto_now_add=True)

class ReplenishmentRequest(models.Model):
    STATUS_CHOICES = [
        ('PENDING', 'Pending'),
        ('APPROVED', 'Approved'),
        ('FULFILLED', 'Fulfilled'),
    ]
    shop = models.ForeignKey(Shop, on_delete=models.CASCADE)
    product = models.ForeignKey(FinishedGoods, on_delete=models.CASCADE)
    requested_quantity = models.IntegerField()
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='PENDING')
    request_date = models.DateTimeField(auto_now_add=True)
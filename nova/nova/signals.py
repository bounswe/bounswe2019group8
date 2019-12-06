from django.db.models.signals import post_save
from django.dispatch import receiver

from nova.models import TradingEquipment, Order, CurrentPrice


@receiver(post_save, sender = TradingEquipment)
def check_orders(sender, instance,  **kwargs):
    current_price = CurrentPrice.objects.get(tr_eq = instance.pk)
    orders = Order.objects.get(tr_eq = instance.pk)
    for order in orders:
        order_type = order.type
        if order_type == 1:
            # CHECK BUY ORDERS
            trigger = order.trigger
        else:
            # CHECK SELL ORDERS
            trigger = order.trigger
    return


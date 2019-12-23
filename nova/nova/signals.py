from django.db.models.signals import post_save
from django.dispatch import receiver

from nova.models import ArticleComment, Annotation, Article, Notification


# @receiver(post_save, sender = TradingEquipment)
# def check_orders(sender, instance,  **kwargs):
#    current_price = CurrentPrice.objects.get(tr_eq = instance.pk)
#    orders = Order.objects.get(tr_eq = instance.pk)
#    for order in orders:
#        order_type = order.type
#        if order_type == 1:
#            # CHECK BUY ORDERS
#            trigger = order.trigger
#        else:
# CHECK SELL ORDERS
#            trigger = order.trigger
#    return


def create_following_notifications(instance, reason, source_key, source_user):
    for follower in source_user.followers.all():
        notification = Notification.objects.create(to=follower, reason=reason, source_type='following_user',
                                                   source_user=source_user, **{source_key: instance})
        notification.save()


@receiver(post_save, sender=Annotation)
def create_annotation_notification(sender, instance, **kwargs):
    if not kwargs['created']:
        return

    create_following_notifications(instance, 'annotation_create', 'source_annotation', instance.owner)


@receiver(post_save, sender=ArticleComment)
def create_comment_notification(sender, instance, **kwargs):
    if not kwargs['created']:
        return

    create_following_notifications(instance, 'comment_create', 'source_comment', instance.author)


@receiver(post_save, sender=Article)
def create_article_notification(sender, instance, **kwargs):
    if not kwargs['created']:
        return

    create_following_notifications(instance, 'article_create', 'source_article', instance.author)

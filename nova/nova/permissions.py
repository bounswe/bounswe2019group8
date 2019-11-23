from rest_framework import permissions


def is_user_in_group(user, group_name):
    return bool(user and user.groups.filter(name=group_name).exists())


class Public(permissions.BasePermission):
    def has_permission(self, request, view):
        return True


class IsPostOrIsAuthenticated(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.method == 'POST':
            return True

        return bool(request.user and request.user.is_authenticated)


class IsGetOrIsAdmin(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.method == 'GET':
            return True
        return bool(request.user and is_user_in_group(request.user, "admin"))


class IsGetOrIsAuthenticated(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.method == 'GET':
            return True
        return bool(request.user and request.user.is_authenticated)


class IsTraderUser(permissions.BasePermission):
    def has_permission(self, request, view):
        return is_user_in_group(request.user, "trader")


class IsAdminUser(permissions.BasePermission):
    def has_permission(self, request, view):
        return is_user_in_group(request.user, "admin")

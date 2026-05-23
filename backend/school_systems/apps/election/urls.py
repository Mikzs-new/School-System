from django.urls import path, include

from .api import views as election

from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r'vote', election.VoteViewSet, basename='vote')
router.register(r'candidates', election.CandidateViewSet, basename='candidates')
router.register(r'partylists', election.PartylistViewSet, basename='partylists')
router.register(r'elections', election.ElectionViewSet, basename='elections')
router.register(r'votes', election.VoteViewSet, basename='votes')

urlpatterns = [
    path('',include(router.urls)),
]
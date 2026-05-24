from django.urls import path, include

from .api import views as election

from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r'vote', election.VoteViewSet, basename='vote')
router.register(r'candidates', election.CandidateViewSet, basename='candidates')
router.register(r'partylists', election.PartylistViewSet, basename='partylists')
router.register(r'elections', election.ElectionViewSet, basename='elections')

router_create = DefaultRouter()
router_create.register(r'eligible_course', election.ElectionEligibleCourseViewSet, basename='eligible_course')
router_create.register(r'eligible_position', election.ElectionEligiblePositionViewSet, basename='eligible_position')
router_create.register(r'eligible_year_level', election.ElectionEligibleYearLevelViewSet, basename='eligible_year_level')
router_create.register(r'eligible_partylist', election.PartylistElectionViewSet, basename='eligible_partylist')

urlpatterns = [
    path('',include(router.urls)),
    path('create/',include(router_create.urls))
]
from apps.election.models.vote import Vote
from apps.election.models.candidate import Candidate

class VoteSelector:
    @staticmethod
    def student_already_vote(student_info, election):
        return Vote.objects.filter(student_info=student_info,election=election).exists()
    
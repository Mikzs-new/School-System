import 'package:flutter/material.dart';

class ElectionsScreen extends StatelessWidget {
  const ElectionsScreen({
    super.key,
  });

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor:
          const Color(0xFFF5F7FB),

      body: SafeArea(
        child: Padding(
          padding:
              const EdgeInsets.all(20),
          child: Column(
            crossAxisAlignment:
                CrossAxisAlignment.start,
            children: [

              const Text(
                'Available Elections',
                style: TextStyle(
                  fontSize: 30,
                  fontWeight:
                      FontWeight.bold,
                ),
              ),

              const SizedBox(height: 6),

              const Text(
                'Participate in ongoing and upcoming elections.',
                style: TextStyle(
                  color: Colors.grey,
                  fontSize: 15,
                ),
              ),

              const SizedBox(height: 30),

              Expanded(
                child: ListView(
                  children: [

                    electionCard(
                      title:
                          'SSC Election 2026',

                      status: 'ACTIVE',

                      description:
                          'Vote for the next Supreme Student Council officers.',

                      days:
                          'Ends in 2 Days',
                    ),

                    electionCard(
                      title:
                          'Department Election',

                      status: 'UPCOMING',

                      description:
                          'Department representative election for students.',

                      days:
                          'Starts Tomorrow',
                    ),

                    electionCard(
                      title:
                          'Club Organization Voting',

                      status: 'COMPLETED',

                      description:
                          'Final results have already been released.',

                      days:
                          'Voting Closed',
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget electionCard({
    required String title,
    required String status,
    required String description,
    required String days,
  }) {

    Color statusColor =
        const Color(0xFF2563EB);

    if (status == 'UPCOMING') {
      statusColor = Colors.orange;
    }

    if (status == 'COMPLETED') {
      statusColor = Colors.green;
    }

    return Container(
      margin:
          const EdgeInsets.only(
        bottom: 20,
      ),

      padding:
          const EdgeInsets.all(22),

      decoration: BoxDecoration(
        color: Colors.white,

        borderRadius:
            BorderRadius.circular(
          24,
        ),

        boxShadow: [
          BoxShadow(
            color:
                Colors.black.withOpacity(
              0.03,
            ),
            blurRadius: 10,
            offset: const Offset(0, 4),
          ),
        ],
      ),

      child: Column(
        crossAxisAlignment:
            CrossAxisAlignment.start,

        children: [

          Row(
            mainAxisAlignment:
                MainAxisAlignment
                    .spaceBetween,

            children: [

              Expanded(
                child: Text(
                  title,
                  style:
                      const TextStyle(
                    fontSize: 22,
                    fontWeight:
                        FontWeight.bold,
                  ),
                ),
              ),

              Container(
                padding:
                    const EdgeInsets.symmetric(
                  horizontal: 14,
                  vertical: 8,
                ),

                decoration: BoxDecoration(
                  color:
                      statusColor.withOpacity(
                    0.15,
                  ),

                  borderRadius:
                      BorderRadius.circular(
                    30,
                  ),
                ),

                child: Text(
                  status,

                  style: TextStyle(
                    color: statusColor,
                    fontWeight:
                        FontWeight.bold,
                  ),
                ),
              ),
            ],
          ),

          const SizedBox(height: 18),

          Text(
            description,

            style: const TextStyle(
              color: Colors.grey,
              height: 1.5,
            ),
          ),

          const SizedBox(height: 20),

          Row(
            children: [

              const Icon(
                Icons.schedule,
                size: 18,
                color: Colors.grey,
              ),

              const SizedBox(width: 8),

              Text(
                days,

                style: const TextStyle(
                  color: Colors.grey,
                ),
              ),
            ],
          ),

          const SizedBox(height: 24),

          SizedBox(
            width: double.infinity,

            height: 52,

            child: ElevatedButton(
              style:
                  ElevatedButton.styleFrom(
                backgroundColor:
                    const Color(
                  0xFF2563EB,
                ),

                foregroundColor:
                    Colors.white,

                shape:
                    RoundedRectangleBorder(
                  borderRadius:
                      BorderRadius.circular(
                    16,
                  ),
                ),
              ),

              onPressed: () {},

              child: const Text(
                'View Election',
              ),
            ),
          ),
        ],
      ),
    );
  }
}
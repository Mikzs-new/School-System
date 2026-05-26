import 'package:flutter/material.dart';

class ResultsScreen extends StatelessWidget {
  const ResultsScreen({
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
                'Election Results',
                style: TextStyle(
                  fontSize: 30,
                  fontWeight:
                      FontWeight.bold,
                ),
              ),

              const SizedBox(height: 6),

              const Text(
                'View completed election results and rankings.',
                style: TextStyle(
                  color: Colors.grey,
                  fontSize: 15,
                ),
              ),

              const SizedBox(height: 30),

              Expanded(
                child: ListView(
                  children: [

                    resultCard(
                      election:
                          'SSC Election 2026',

                      winner:
                          'John Doe',

                      percentage: 72,

                      votes: 1240,
                    ),

                    resultCard(
                      election:
                          'Department Election',

                      winner:
                          'Jane Smith',

                      percentage: 65,

                      votes: 890,
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

  Widget resultCard({
    required String election,
    required String winner,
    required int percentage,
    required int votes,
  }) {

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
                  election,
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
                      Colors.green
                          .withOpacity(
                    0.15,
                  ),

                  borderRadius:
                      BorderRadius.circular(
                    30,
                  ),
                ),

                child: const Text(
                  'COMPLETED',

                  style: TextStyle(
                    color:
                        Colors.green,
                    fontWeight:
                        FontWeight.bold,
                  ),
                ),
              ),
            ],
          ),

          const SizedBox(height: 20),

          const Text(
            'Winner',
            style: TextStyle(
              color: Colors.grey,
            ),
          ),

          const SizedBox(height: 6),

          Text(
            winner,
            style: const TextStyle(
              fontSize: 26,
              fontWeight:
                  FontWeight.bold,
            ),
          ),

          const SizedBox(height: 20),

          ClipRRect(
            borderRadius:
                BorderRadius.circular(
              20,
            ),

            child:
                LinearProgressIndicator(
              value:
                  percentage / 100,

              minHeight: 14,

              backgroundColor:
                  Colors.grey[200],

              color:
                  const Color(
                0xFF2563EB,
              ),
            ),
          ),

          const SizedBox(height: 14),

          Row(
            mainAxisAlignment:
                MainAxisAlignment
                    .spaceBetween,

            children: [

              Text(
                '$percentage% Votes',
                style: const TextStyle(
                  fontWeight:
                      FontWeight.bold,
                ),
              ),

              Text(
                '$votes Total Votes',
                style: const TextStyle(
                  color: Colors.grey,
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }
}
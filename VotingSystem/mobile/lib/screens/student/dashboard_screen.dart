import 'package:flutter/material.dart';

class DashboardScreen extends StatelessWidget {
  const DashboardScreen({
    super.key,
  });

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor:
          const Color(0xFFF5F7FB),

      body: SafeArea(
        child: SingleChildScrollView(
          padding:
              const EdgeInsets.all(20),
          child: Column(
            crossAxisAlignment:
                CrossAxisAlignment.start,
            children: [

              // HEADER
              Row(
                mainAxisAlignment:
                    MainAxisAlignment
                        .spaceBetween,
                children: [

                  Column(
                    crossAxisAlignment:
                        CrossAxisAlignment
                            .start,
                    children: const [

                      Text(
                        'Welcome,',
                        style: TextStyle(
                          fontSize: 18,
                          color:
                              Colors.grey,
                        ),
                      ),

                      SizedBox(height: 4),

                      Text(
                        'rmmc_gsc-1',
                        style: TextStyle(
                          fontSize: 30,
                          fontWeight:
                              FontWeight.bold,
                        ),
                      ),

                      SizedBox(height: 4),

                      Text(
                        'RMMC Voting System',
                        style: TextStyle(
                          fontSize: 15,
                          color:
                              Colors.grey,
                        ),
                      ),
                    ],
                  ),

                  Container(
                    width: 55,
                    height: 55,
                    decoration:
                        BoxDecoration(
                      color:
                          Colors.white,
                      borderRadius:
                          BorderRadius.circular(
                        16,
                      ),
                    ),

                    child: const Icon(
                      Icons.person,
                      size: 30,
                    ),
                  ),
                ],
              ),

              const SizedBox(height: 30),

              // HERO CARD
              Container(
                width: double.infinity,
                padding:
                    const EdgeInsets.all(24),

                decoration: BoxDecoration(
                  borderRadius:
                      BorderRadius.circular(
                    24,
                  ),

                  gradient:
                      const LinearGradient(
                    colors: [
                      Color(0xFF2563EB),
                      Color(0xFF1D4ED8),
                    ],
                  ),
                ),

                child: Column(
                  crossAxisAlignment:
                      CrossAxisAlignment
                          .start,
                  children: [

                    const Text(
                      'Active Election',
                      style: TextStyle(
                        color:
                            Colors.white70,
                        fontSize: 16,
                      ),
                    ),

                    const SizedBox(
                      height: 10,
                    ),

                    const Text(
                      'SSC Election 2026',
                      style: TextStyle(
                        color:
                            Colors.white,
                        fontSize: 28,
                        fontWeight:
                            FontWeight.bold,
                      ),
                    ),

                    const SizedBox(
                      height: 12,
                    ),

                    const Text(
                      'Vote securely and participate in shaping the future of RMMC.',
                      style: TextStyle(
                        color:
                            Colors.white,
                        height: 1.5,
                      ),
                    ),

                    const SizedBox(
                      height: 20,
                    ),

                    ElevatedButton(
                      style:
                          ElevatedButton.styleFrom(
                        backgroundColor:
                            Colors.white,

                        foregroundColor:
                            const Color(
                          0xFF1D4ED8,
                        ),

                        padding:
                            const EdgeInsets.symmetric(
                          horizontal: 24,
                          vertical: 14,
                        ),
                      ),

                      onPressed: () {},

                      child: const Text(
                        'Vote Now',
                      ),
                    ),
                  ],
                ),
              ),

              const SizedBox(height: 30),

              // QUICK ACTIONS
              const Text(
                'Quick Access',
                style: TextStyle(
                  fontSize: 22,
                  fontWeight:
                      FontWeight.bold,
                ),
              ),

              const SizedBox(height: 20),

              GridView.count(
                shrinkWrap: true,
                physics:
                    const NeverScrollableScrollPhysics(),

                crossAxisCount: 2,

                crossAxisSpacing: 16,
                mainAxisSpacing: 16,

                childAspectRatio: 1.1,

                children: [

                  dashboardCard(
                    icon:
                        Icons.how_to_vote,
                    title: 'Elections',
                    subtitle:
                        'View elections',
                  ),

                  dashboardCard(
                    icon: Icons.people,
                    title: 'Candidates',
                    subtitle:
                        'Browse candidates',
                  ),

                  dashboardCard(
                    icon:
                        Icons.bar_chart,
                    title: 'Results',
                    subtitle:
                        'Election results',
                  ),

                  dashboardCard(
                    icon: Icons.person,
                    title: 'Profile',
                    subtitle:
                        'Student account',
                  ),
                ],
              ),

              const SizedBox(height: 30),

              // RECENT ACTIVITY
              const Text(
                'Recent Activity',
                style: TextStyle(
                  fontSize: 22,
                  fontWeight:
                      FontWeight.bold,
                ),
              ),

              const SizedBox(height: 20),

              activityTile(
                title:
                    'SSC Election is now active',
                subtitle:
                    'Voting has officially started.',
              ),

              activityTile(
                title:
                    'Candidates have been updated',
                subtitle:
                    'New candidate information available.',
              ),

              activityTile(
                title:
                    'Voting closes in 2 days',
                subtitle:
                    'Submit your vote before deadline.',
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget dashboardCard({
    required IconData icon,
    required String title,
    required String subtitle,
  }) {
    return Container(
      padding:
          const EdgeInsets.all(20),

      decoration: BoxDecoration(
        color: Colors.white,

        borderRadius:
            BorderRadius.circular(
          20,
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

          Container(
            padding:
                const EdgeInsets.all(12),

            decoration: BoxDecoration(
              color: const Color(
                0xFFE0EAFF,
              ),

              borderRadius:
                  BorderRadius.circular(
                14,
              ),
            ),

            child: Icon(
              icon,
              color:
                  const Color(
                0xFF2563EB,
              ),
            ),
          ),

          const Spacer(),

          Text(
            title,
            style: const TextStyle(
              fontSize: 18,
              fontWeight:
                  FontWeight.bold,
            ),
          ),

          const SizedBox(height: 6),

          Text(
            subtitle,
            style: const TextStyle(
              color: Colors.grey,
            ),
          ),
        ],
      ),
    );
  }

  Widget activityTile({
    required String title,
    required String subtitle,
  }) {
    return Container(
      margin:
          const EdgeInsets.only(
        bottom: 14,
      ),

      padding:
          const EdgeInsets.all(18),

      decoration: BoxDecoration(
        color: Colors.white,

        borderRadius:
            BorderRadius.circular(
          18,
        ),
      ),

      child: Row(
        children: [

          Container(
            width: 45,
            height: 45,

            decoration: BoxDecoration(
              color:
                  const Color(
                0xFFE0EAFF,
              ),

              borderRadius:
                  BorderRadius.circular(
                12,
              ),
            ),

            child: const Icon(
              Icons.notifications,
              color:
                  Color(
                0xFF2563EB,
              ),
            ),
          ),

          const SizedBox(width: 16),

          Expanded(
            child: Column(
              crossAxisAlignment:
                  CrossAxisAlignment
                      .start,

              children: [

                Text(
                  title,
                  style:
                      const TextStyle(
                    fontWeight:
                        FontWeight.bold,
                  ),
                ),

                const SizedBox(
                  height: 4,
                ),

                Text(
                  subtitle,
                  style:
                      const TextStyle(
                    color:
                        Colors.grey,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
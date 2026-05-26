import 'package:flutter/material.dart';

import '../../services/storage_service.dart';
import '../auth/login_screen.dart';

class ProfileScreen extends StatelessWidget {
  const ProfileScreen({
    super.key,
  });

  Future<void> logout(
    BuildContext context,
  ) async {

    await StorageService.clearAll();

    if (!context.mounted) return;

    Navigator.pushAndRemoveUntil(
      context,
      MaterialPageRoute(
        builder: (context) {
          return const LoginScreen();
        },
      ),
      (route) => false,
    );
  }

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
            children: [

              // PROFILE CARD
              Container(
                width: double.infinity,

                padding:
                    const EdgeInsets.all(24),

                decoration: BoxDecoration(
                  color: Colors.white,

                  borderRadius:
                      BorderRadius.circular(
                    24,
                  ),

                  boxShadow: [
                    BoxShadow(
                      color:
                          Colors.black
                              .withOpacity(
                        0.03,
                      ),

                      blurRadius: 10,

                      offset:
                          const Offset(
                        0,
                        4,
                      ),
                    ),
                  ],
                ),

                child: Column(
                  children: [

                    const CircleAvatar(
                      radius: 42,

                      backgroundColor:
                          Color(
                        0xFFE0EAFF,
                      ),

                      child: Icon(
                        Icons.person,
                        size: 42,
                        color:
                            Color(
                          0xFF2563EB,
                        ),
                      ),
                    ),

                    const SizedBox(
                      height: 18,
                    ),

                    const Text(
                      'rmmc_gsc-1',
                      style: TextStyle(
                        fontSize: 26,
                        fontWeight:
                            FontWeight.bold,
                      ),
                    ),

                    const SizedBox(
                      height: 6,
                    ),

                    const Text(
                      'Student Account',
                      style: TextStyle(
                        color:
                            Colors.grey,
                      ),
                    ),

                    const SizedBox(
                      height: 20,
                    ),

                    Container(
                      padding:
                          const EdgeInsets.symmetric(
                        horizontal: 18,
                        vertical: 10,
                      ),

                      decoration:
                          BoxDecoration(
                        color:
                            Colors.green
                                .withOpacity(
                          0.12,
                        ),

                        borderRadius:
                            BorderRadius.circular(
                          30,
                        ),
                      ),

                      child: const Text(
                        'Verified Student',

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
              ),

              const SizedBox(height: 28),

              // STUDENT INFORMATION
              infoSection(
                title:
                    'Student Information',

                children: [

                  infoTile(
                    icon:
                        Icons.school,

                    title:
                        'Course',

                    value:
                        'Bachelor of Science in Information Technology',
                  ),

                  infoTile(
                    icon:
                        Icons.badge,

                    title:
                        'Year Level',

                    value:
                        '3rd Year',
                  ),

                  infoTile(
                    icon:
                        Icons.apartment,

                    title:
                        'Department',

                    value:
                        'College of Computing Studies',
                  ),
                ],
              ),

              const SizedBox(height: 24),

              // VOTING STATUS
              infoSection(
                title:
                    'Voting Status',

                children: [

                  infoTile(
                    icon:
                        Icons.how_to_vote,

                    title:
                        'Eligibility',

                    value:
                        'Eligible to Vote',
                  ),

                  infoTile(
                    icon:
                        Icons.verified,

                    title:
                        'Verification',

                    value:
                        'Verified Account',
                  ),
                ],
              ),

              const SizedBox(height: 28),

              // LOGOUT
              SizedBox(
                width: double.infinity,

                height: 55,

                child:
                    ElevatedButton.icon(

                  style:
                      ElevatedButton.styleFrom(
                    backgroundColor:
                        Colors.red,

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

                  onPressed: () {
                    logout(context);
                  },

                  icon:
                      const Icon(
                    Icons.logout,
                  ),

                  label:
                      const Text(
                    'Logout',
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget infoSection({
    required String title,
    required List<Widget> children,
  }) {

    return Container(
      width: double.infinity,

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

            offset: const Offset(
              0,
              4,
            ),
          ),
        ],
      ),

      child: Column(
        crossAxisAlignment:
            CrossAxisAlignment.start,

        children: [

          Text(
            title,
            style: const TextStyle(
              fontSize: 20,
              fontWeight:
                  FontWeight.bold,
            ),
          ),

          const SizedBox(height: 20),

          ...children,
        ],
      ),
    );
  }

  Widget infoTile({
    required IconData icon,
    required String title,
    required String value,
  }) {

    return Padding(
      padding:
          const EdgeInsets.only(
        bottom: 18,
      ),

      child: Row(
        crossAxisAlignment:
            CrossAxisAlignment.start,

        children: [

          Container(
            padding:
                const EdgeInsets.all(
              12,
            ),

            decoration:
                BoxDecoration(
              color:
                  const Color(
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
                    color:
                        Colors.grey,
                  ),
                ),

                const SizedBox(
                  height: 4,
                ),

                Text(
                  value,
                  style:
                      const TextStyle(
                    fontWeight:
                        FontWeight.bold,
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
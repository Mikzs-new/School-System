import 'package:flutter/material.dart';

class CandidatesScreen extends StatelessWidget {
  const CandidatesScreen({
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
                'Candidates',
                style: TextStyle(
                  fontSize: 30,
                  fontWeight:
                      FontWeight.bold,
                ),
              ),

              const SizedBox(height: 6),

              const Text(
                'View candidates participating in the election.',
                style: TextStyle(
                  color: Colors.grey,
                  fontSize: 15,
                ),
              ),

              const SizedBox(height: 30),

              Expanded(
                child: ListView(
                  children: [

                    candidateCard(
                      name:
                          'John Doe',

                      position:
                          'President',

                      partylist:
                          'Unity Party',

                      color:
                          const Color(
                        0xFF2563EB,
                      ),
                    ),

                    candidateCard(
                      name:
                          'Jane Smith',

                      position:
                          'Vice President',

                      partylist:
                          'Student Alliance',

                      color:
                          Colors.orange,
                    ),

                    candidateCard(
                      name:
                          'Mark Cruz',

                      position:
                          'Secretary',

                      partylist:
                          'Future Leaders',

                      color:
                          Colors.green,
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

  Widget candidateCard({
    required String name,
    required String position,
    required String partylist,
    required Color color,
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

            offset: const Offset(
              0,
              4,
            ),
          ),
        ],
      ),

      child: Row(
        children: [

          CircleAvatar(
            radius: 36,

            backgroundColor:
                color.withOpacity(
              0.15,
            ),

            child: Icon(
              Icons.person,
              size: 38,
              color: color,
            ),
          ),

          const SizedBox(width: 18),

          Expanded(
            child: Column(
              crossAxisAlignment:
                  CrossAxisAlignment
                      .start,

              children: [

                Text(
                  name,
                  style:
                      const TextStyle(
                    fontSize: 22,
                    fontWeight:
                        FontWeight.bold,
                  ),
                ),

                const SizedBox(
                  height: 6,
                ),

                Text(
                  position,
                  style:
                      const TextStyle(
                    color:
                        Colors.grey,
                  ),
                ),

                const SizedBox(
                  height: 10,
                ),

                Container(
                  padding:
                      const EdgeInsets.symmetric(
                    horizontal: 14,
                    vertical: 8,
                  ),

                  decoration:
                      BoxDecoration(
                    color:
                        color.withOpacity(
                      0.12,
                    ),

                    borderRadius:
                        BorderRadius.circular(
                      30,
                    ),
                  ),

                  child: Text(
                    partylist,

                    style: TextStyle(
                      color: color,
                      fontWeight:
                          FontWeight.bold,
                    ),
                  ),
                ),

                const SizedBox(
                  height: 18,
                ),

                Row(
                  children: [

                    Expanded(
                      child:
                          OutlinedButton(
                        style:
                            OutlinedButton.styleFrom(
                          padding:
                              const EdgeInsets.symmetric(
                            vertical: 14,
                          ),

                          shape:
                              RoundedRectangleBorder(
                            borderRadius:
                                BorderRadius.circular(
                              14,
                            ),
                          ),
                        ),

                        onPressed: () {},

                        child:
                            const Text(
                          'Platform',
                        ),
                      ),
                    ),

                    const SizedBox(
                      width: 14,
                    ),

                    Expanded(
                      child:
                          ElevatedButton(
                        style:
                            ElevatedButton.styleFrom(
                          backgroundColor:
                              color,

                          foregroundColor:
                              Colors.white,

                          padding:
                              const EdgeInsets.symmetric(
                            vertical: 14,
                          ),

                          shape:
                              RoundedRectangleBorder(
                            borderRadius:
                                BorderRadius.circular(
                              14,
                            ),
                          ),
                        ),

                        onPressed: () {},

                        child:
                            const Text(
                          'Select',
                        ),
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
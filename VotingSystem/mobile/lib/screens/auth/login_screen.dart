import 'package:flutter/material.dart';

import '../../services/auth_service.dart';
import '../../services/storage_service.dart';

import '../student/student_main_screen.dart';
import 'forgot_password_screen.dart';

class LoginScreen extends StatefulWidget {
  const LoginScreen({super.key});

  @override
  State<LoginScreen> createState() =>
      _LoginScreenState();
}

class _LoginScreenState
    extends State<LoginScreen> {

  final TextEditingController usernameController =
      TextEditingController();

  final TextEditingController passwordController =
      TextEditingController();

  bool isLoading = false;

  String? error;

  Future<void> login() async {

    setState(() {
      isLoading = true;
      error = null;
    });

    try {

      final user =
          await AuthService.login(
        username:
            usernameController.text.trim(),

        password:
            passwordController.text.trim(),
      );

      await StorageService.saveToken(
        user.access,
      );

      await StorageService.saveRole(
        user.role,
      );

      if (!mounted) return;

      Navigator.pushReplacement(
        context,
        MaterialPageRoute(
          builder: (context) {
            return const StudentMainScreen();
          },
        ),
      );

    } catch (e) {

      setState(() {
        error =
            'Invalid username or password';
      });
    }

    setState(() {
      isLoading = false;
    });
  }

  @override
  Widget build(BuildContext context) {

    return Scaffold(
      backgroundColor:
          const Color(0xFFF5F7FB),

      body: SafeArea(
        child: Center(
          child: SingleChildScrollView(
            padding:
                const EdgeInsets.all(24),

            child: SizedBox(
              width: 430,

              child: Container(
                padding:
                    const EdgeInsets.all(30),

                decoration: BoxDecoration(
                  color: Colors.white,

                  borderRadius:
                      BorderRadius.circular(
                    28,
                  ),

                  boxShadow: [
                    BoxShadow(
                      color:
                          Colors.black
                              .withOpacity(
                        0.04,
                      ),

                      blurRadius: 12,

                      offset:
                          const Offset(
                        0,
                        5,
                      ),
                    ),
                  ],
                ),

                child: Column(
                  mainAxisSize:
                      MainAxisSize.min,

                  children: [

                    Container(
                      width: 90,
                      height: 90,

                      decoration:
                          BoxDecoration(
                        color:
                            const Color(
                          0xFFE0EAFF,
                        ),

                        borderRadius:
                            BorderRadius.circular(
                          24,
                        ),
                      ),

                      child: const Icon(
                        Icons.how_to_vote,
                        size: 46,
                        color:
                            Color(
                          0xFF2563EB,
                        ),
                      ),
                    ),

                    const SizedBox(
                      height: 24,
                    ),

                    const Text(
                      'RMMC Voting System',

                      textAlign:
                          TextAlign.center,

                      style: TextStyle(
                        fontSize: 30,
                        fontWeight:
                            FontWeight.bold,
                      ),
                    ),

                    const SizedBox(
                      height: 10,
                    ),

                    const Text(
                      'Login to continue to the student portal.',

                      textAlign:
                          TextAlign.center,

                      style: TextStyle(
                        color: Colors.grey,
                        height: 1.5,
                      ),
                    ),

                    const SizedBox(
                      height: 32,
                    ),

                    TextField(
                      controller:
                          usernameController,

                      decoration:
                          InputDecoration(
                        labelText:
                            'Username',

                        prefixIcon:
                            const Icon(
                          Icons.person,
                        ),

                        filled: true,

                        fillColor:
                            const Color(
                          0xFFF8FAFC,
                        ),

                        border:
                            OutlineInputBorder(
                          borderRadius:
                              BorderRadius.circular(
                            18,
                          ),

                          borderSide:
                              BorderSide.none,
                        ),
                      ),
                    ),

                    const SizedBox(
                      height: 22,
                    ),

                    TextField(
                      controller:
                          passwordController,

                      obscureText: true,

                      decoration:
                          InputDecoration(
                        labelText:
                            'Password',

                        prefixIcon:
                            const Icon(
                          Icons.lock,
                        ),

                        filled: true,

                        fillColor:
                            const Color(
                          0xFFF8FAFC,
                        ),

                        border:
                            OutlineInputBorder(
                          borderRadius:
                              BorderRadius.circular(
                            18,
                          ),

                          borderSide:
                              BorderSide.none,
                        ),
                      ),
                    ),

                    const SizedBox(
                      height: 10,
                    ),

                    Align(
                      alignment:
                          Alignment
                              .centerRight,

                      child: TextButton(
                        onPressed: () {

                          Navigator.push(
                            context,

                            MaterialPageRoute(
                              builder: (context) {
                                return const ForgotPasswordScreen();
                              },
                            ),
                          );
                        },

                        child: const Text(
                          'Forgot Password?',
                        ),
                      ),
                    ),

                    if (error != null)

                      Container(
                        width:
                            double.infinity,

                        margin:
                            const EdgeInsets.only(
                          bottom: 20,
                        ),

                        padding:
                            const EdgeInsets.all(
                          14,
                        ),

                        decoration:
                            BoxDecoration(
                          color:
                              Colors.red
                                  .withOpacity(
                            0.08,
                          ),

                          borderRadius:
                              BorderRadius.circular(
                            14,
                          ),
                        ),

                        child: Text(
                          error!,

                          style:
                              const TextStyle(
                            color:
                                Colors.red,
                          ),
                        ),
                      ),

                    SizedBox(
                      width:
                          double.infinity,

                      height: 56,

                      child:
                          ElevatedButton(
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
                              18,
                            ),
                          ),
                        ),

                        onPressed:
                            isLoading
                                ? null
                                : login,

                        child:
                            isLoading
                                ? const CircularProgressIndicator(
                                    color:
                                        Colors.white,
                                  )
                                : const Text(
                                    'Login',

                                    style: TextStyle(
                                      fontSize: 16,
                                      fontWeight:
                                          FontWeight.bold,
                                    ),
                                  ),
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ),
        ),
      ),
    );
  }
}
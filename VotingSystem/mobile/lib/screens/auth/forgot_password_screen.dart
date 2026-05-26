import 'package:dio/dio.dart';
import 'package:flutter/material.dart';

import '../../api/api_client.dart';
import 'verify_otp_screen.dart';

class ForgotPasswordScreen extends StatefulWidget {
  const ForgotPasswordScreen({
    super.key,
  });

  @override
  State<ForgotPasswordScreen> createState() =>
      _ForgotPasswordScreenState();
}

class _ForgotPasswordScreenState
    extends State<ForgotPasswordScreen> {

  final TextEditingController emailController =
      TextEditingController();

  bool isLoading = false;

  String? error;

  Future<void> sendOtp() async {

    setState(() {
      isLoading = true;
      error = null;
    });

    try {

      await ApiClient.dio.post(
        '/auth/forgot-password/',
        data: {
          'email':
              emailController.text.trim(),
        },
      );

      if (!mounted) return;

      Navigator.push(
        context,
        MaterialPageRoute(
          builder: (context) {
            return VerifyOtpScreen(
              email:
                  emailController.text.trim(),
            );
          },
        ),
      );

    } on DioException catch (e) {

      setState(() {
        error =
            e.response?.data.toString() ??
            'Something went wrong';
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
                        Icons.lock_reset,
                        size: 45,
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
                      'Forgot Password',

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
                      'Enter your registered email address to receive an OTP.',

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
                          emailController,

                      decoration:
                          InputDecoration(
                        labelText:
                            'Email Address',

                        prefixIcon:
                            const Icon(
                          Icons.email,
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
                      height: 24,
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
                                : sendOtp,

                        child:
                            isLoading
                                ? const CircularProgressIndicator(
                                    color:
                                        Colors.white,
                                  )
                                : const Text(
                                    'Send OTP',
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
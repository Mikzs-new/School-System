import 'package:dio/dio.dart';
import 'package:flutter/material.dart';

import '../../api/api_client.dart';
import 'login_screen.dart';

class VerifyOtpScreen extends StatefulWidget {

  final String email;

  const VerifyOtpScreen({
    super.key,
    required this.email,
  });

  @override
  State<VerifyOtpScreen> createState() =>
      _VerifyOtpScreenState();
}

class _VerifyOtpScreenState
    extends State<VerifyOtpScreen> {

  final TextEditingController otpController =
      TextEditingController();

  final TextEditingController passwordController =
      TextEditingController();

  final TextEditingController confirmPasswordController =
      TextEditingController();

  bool isLoading = false;

  String? error;

  Future<void> resetPassword() async {

    if (passwordController.text !=
        confirmPasswordController.text) {

      setState(() {
        error = 'Passwords do not match';
      });

      return;
    }

    setState(() {
      isLoading = true;
      error = null;
    });

    try {

      await ApiClient.dio.post(
        '/auth/reset-password/',
        data: {
          'email': widget.email,
          'otp':
              otpController.text.trim(),
          'password':
              passwordController.text,
        },
      );

      if (!mounted) return;

      Navigator.pushAndRemoveUntil(
        context,
        MaterialPageRoute(
          builder: (context) {
            return const LoginScreen();
          },
        ),
        (route) => false,
      );

    } on DioException catch (e) {

      setState(() {
        error =
            e.response?.data.toString() ??
            'Reset failed';
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
                        Icons.verified_user,
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
                      'Verify OTP',

                      style: TextStyle(
                        fontSize: 30,
                        fontWeight:
                            FontWeight.bold,
                      ),
                    ),

                    const SizedBox(
                      height: 10,
                    ),

                    Text(
                      widget.email,

                      textAlign:
                          TextAlign.center,

                      style:
                          const TextStyle(
                        color: Colors.grey,
                      ),
                    ),

                    const SizedBox(
                      height: 32,
                    ),

                    TextField(
                      controller:
                          otpController,

                      decoration:
                          InputDecoration(
                        labelText:
                            'OTP Code',

                        prefixIcon:
                            const Icon(
                          Icons.password,
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
                            'New Password',

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
                      height: 22,
                    ),

                    TextField(
                      controller:
                          confirmPasswordController,

                      obscureText: true,

                      decoration:
                          InputDecoration(
                        labelText:
                            'Confirm Password',

                        prefixIcon:
                            const Icon(
                          Icons.lock_outline,
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
                                : resetPassword,

                        child:
                            isLoading
                                ? const CircularProgressIndicator(
                                    color:
                                        Colors.white,
                                  )
                                : const Text(
                                    'Reset Password',
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
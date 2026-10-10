import * as yup from "yup";


export type SignupFormData = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: "user" | "seller";
};

export const signupSchema = yup.object({
  firstName: yup
    .string()
    .required("First name is required")
    .min(2, "First name must be at least 2 characters"),

  lastName: yup
    .string()
    .required("Last name is required")
    .min(2, "Last name must be at least 2 characters"),

  email: yup
    .string()
    .required("Email is required")
    .email("Enter a valid email address"),

  password: yup
    .string()
    .required("Password is required")
    .min(6, "Password must be at least 6 characters"),

  confirmPassword: yup
    .string()
    .required("Please confirm your password")
    .oneOf(
      [yup.ref("password")],
      "Passwords do not match"
    ),

  role: yup
    .mixed<"user" | "seller">()
    .oneOf(
      ["user", "seller"],
      "Please select a valid role"
    )
    .required("Role is required"),
});

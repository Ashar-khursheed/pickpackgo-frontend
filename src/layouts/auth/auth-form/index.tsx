'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  Phone,
  ArrowRight,
  ArrowLeft,
  MapPin,
  Building2,
  Hash,
  Globe,
  FileText,
  Briefcase,
} from 'lucide-react';

import { notify } from '@/utils';
import makeApiRequest, { setAuthToken } from '@/network-request/axios';
import { apiurl } from '@/network-request/apis';

interface ModalAuthFormProps {
  mode: 'login' | 'signup';
  onSuccess?: () => void;
  onToggleMode?: () => void;
  initialProfileType?: ProfileType;
}

type ProfileType = 'customer' | 'agency' | null;

const signupValidationSchema = Yup.object({
  first_name: Yup.string()
    .min(2, 'Min 2 characters')
    .max(50, 'Max 50 characters')
    .required('First name is required')
    .matches(/^[a-zA-Z\s]+$/, 'Letters only'),

  last_name: Yup.string()
    .min(2, 'Min 2 characters')
    .max(50, 'Max 50 characters')
    .required('Last name is required')
    .matches(/^[a-zA-Z\s]+$/, 'Letters only'),

  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required')
    .matches(
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      'Enter a valid email address'
    ),

  phone: Yup.string()
    .required('Phone number is required')
    .matches(/^\+?[1-9]\d{1,14}$/, 'Enter a valid phone with country code (e.g. +1234567890)'),

  country: Yup.string()
    .required('Country is required')
    .min(2, 'Min 2 characters'),

  password: Yup.string()
    .min(8, 'Min 8 characters')
    .max(50, 'Max 50 characters')
    .required('Password is required')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Must have uppercase, lowercase, and a number'
    ),

  password_confirmation: Yup.string()
    .required('Please confirm your password')
    .oneOf([Yup.ref('password')], 'Passwords must match'),

  agreeToTerms: Yup.boolean()
    .oneOf([true], 'You must accept the terms and conditions')
    .required('You must accept the terms and conditions'),

  _profileType: Yup.string(),

  agency_name: Yup.string().when('_profileType', {
    is: 'agency',
    then: (schema) => schema.required('Agency name is required').min(2, 'Min 2 characters'),
    otherwise: (schema) => schema.notRequired(),
  }),

  tax_id: Yup.string().when('_profileType', {
    is: 'agency',
    then: (schema) => schema.required('Tax ID is required'),
    otherwise: (schema) => schema.notRequired(),
  }),

  website: Yup.string().when('_profileType', {
    is: 'agency',
    then: (schema) =>
      schema
        .url('Enter a valid URL (e.g. https://example.com)')
        .required('Website is required'),
    otherwise: (schema) => schema.notRequired(),
  }),

  business_name: Yup.string().when('_profileType', {
    is: 'agency',
    then: (schema) => schema.required('Business name is required').min(2, 'Min 2 characters'),
    otherwise: (schema) => schema.notRequired(),
  }),

  business_registration_number: Yup.string().when('_profileType', {
    is: 'agency',
    then: (schema) => schema.required('Business registration number is required'),
    otherwise: (schema) => schema.notRequired(),
  }),

  bio: Yup.string().when('_profileType', {
    is: 'agency',
    then: (schema) => schema.required('Bio is required').min(10, 'Min 10 characters').max(500, 'Max 500 characters'),
    otherwise: (schema) => schema.notRequired(),
  }),
});

const loginValidationSchema = Yup.object({
  email: Yup.string().email('Invalid email address').required('Email is required'),
  password: Yup.string().required('Password is required'),
});

export default function ModalAuthForm({ mode, onSuccess, onToggleMode, initialProfileType }: ModalAuthFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [profileType, setProfileType] = useState<ProfileType>(initialProfileType ?? null);

  const signupFormik = useFormik({
    initialValues: {
      first_name: '',
      last_name: '',
      email: '',
      phone: '',
      country: '',
      password: '',
      password_confirmation: '',
      agreeToTerms: false,
      _profileType: initialProfileType ?? '',
      agency_name: '',
      tax_id: '',
      website: '',
      business_name: '',
      business_registration_number: '',
      bio: '',
    },
    validationSchema: signupValidationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const payload: Record<string, any> = {
          first_name: values.first_name.trim(),
          last_name: values.last_name.trim(),
          email: values.email.trim().toLowerCase(),
          phone: values.phone.trim(),
          country: values.country.trim(),
          password: values.password,
          password_confirmation: values.password_confirmation,
          user_type: `${profileType === 'agency' ? 'agency' : 'customer'}`,
        };

        if (profileType === 'agency') {
          payload.agency_profile = {
            agency_name: values.agency_name.trim(),
            tax_id: values.tax_id.trim(),
            website: values.website.trim(),
          };
          payload.host_profile = {
            business_name: values.business_name.trim(),
            business_registration_number: values.business_registration_number.trim(),
            bio: values.bio.trim(),
          };
        }

        const response = await makeApiRequest(apiurl.register, {
          method: 'POST',
          data: payload,
        });

        if (response?.token) {
          notify({ message: 'Registration successful!', type: 'success' });
          if (onSuccess) onSuccess();
        } else if (response?.message) {
          notify({ message: response.message, type: 'success' });
        }
      } catch (error: any) {
        console.error('Registration error:', error);
        if (error.response?.data?.errors) {
          const errors = error.response.data.errors;
          Object.keys(errors).forEach((key) => {
            notify({ message: errors[key][0], type: 'error' });
          });
        }
      } finally {
        setSubmitting(false);
      }
    },
  });

  const loginFormik = useFormik({
    initialValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
    validationSchema: loginValidationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const payload = {
          email: values.email.trim().toLowerCase(),
          password: values.password,
          remember_me: values.rememberMe,
        };

        const response = await makeApiRequest(apiurl.login, {
          method: 'POST',
          data: payload,
        });

        if (response?.success && response?.data?.token) {
          setAuthToken(response.data.token);
          localStorage.setItem('user', JSON.stringify(response.data.user));
          notify({ message: response.message || 'Login successful!', type: 'success' });
          if (onSuccess) onSuccess();
        }
      } catch (error: any) {
        console.error('Login error:', error);
        const errorMessage = error?.response?.data?.message || 'Login failed. Please try again.';
        notify({ message: errorMessage, type: 'error' });
      } finally {
        setSubmitting(false);
      }
    },
  });

  const handleProfileSelect = (type: 'customer' | 'agency') => {
    setProfileType(type);
    signupFormik.setFieldValue('_profileType', type);
  };

  const formik = mode === 'signup' ? signupFormik : loginFormik;

  // Step 1: profile type selection (signup only)
  if (mode === 'signup' && profileType === null) {
    return (
      <div className="w-full">
        <p className="text-gray-500 text-sm text-center mb-6">
          Choose how you want to create your account.
        </p>
        <div className="grid grid-cols-2 gap-4">
          <button
            type="button"
            onClick={() => handleProfileSelect('customer')}
            className="flex flex-col items-center gap-4 p-6 border-2 border-gray-200 rounded-xl hover:border-emerald-500 hover:bg-emerald-50 transition-all duration-200 group"
          >
            <div className="w-16 h-16 bg-emerald-100 group-hover:bg-emerald-200 rounded-full flex items-center justify-center transition-colors">
              <User className="w-8 h-8 text-emerald-600" />
            </div>
            <div className="text-center">
              <h3 className="font-semibold text-gray-900 text-base">Customer</h3>
              <p className="text-gray-500 text-sm mt-1">Browse and book travel experiences</p>
            </div>
          </button>

          <button
            type="button"
            onClick={() => handleProfileSelect('agency')}
            className="flex flex-col items-center gap-4 p-6 border-2 border-gray-200 rounded-xl hover:border-emerald-500 hover:bg-emerald-50 transition-all duration-200 group"
          >
            <div className="w-16 h-16 bg-emerald-100 group-hover:bg-emerald-200 rounded-full flex items-center justify-center transition-colors">
              <Building2 className="w-8 h-8 text-emerald-600" />
            </div>
            <div className="text-center">
              <h3 className="font-semibold text-gray-900 text-base">Agency</h3>
              <p className="text-gray-500 text-sm mt-1">List and manage travel packages</p>
            </div>
          </button>
        </div>
      </div>
    );
  }

  // Step 2: registration form
  return (
    <div className="w-full">
      {mode === 'signup' && (
        <button
          type="button"
          onClick={() => setProfileType(null)}
          className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-4 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>
      )}

      <div className="mb-5">
        <p className="text-gray-600 text-sm">
          {mode === 'login'
            ? 'Welcome back! Please login to your account.'
            : `Creating ${profileType === 'agency' ? 'an Agency' : 'a Customer'} account`}
        </p>
      </div>

      <form onSubmit={formik.handleSubmit} className="space-y-4">

        {/* First Name + Last Name */}
        {mode === 'signup' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <div className="space-y-1 flex-1">
              <Label htmlFor="first_name" className="text-sm font-medium text-gray-700">
                First Name <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  id="first_name"
                  type="text"
                  placeholder="John"
                  className={`pl-10 h-11 border-2 focus:border-emerald-500 ${
                    signupFormik.touched.first_name && signupFormik.errors.first_name ? 'border-red-500' : ''
                  }`}
                  {...signupFormik.getFieldProps('first_name')}
                />
              </div>
              {signupFormik.touched.first_name && signupFormik.errors.first_name && (
                <p className="text-xs text-red-500">{signupFormik.errors.first_name}</p>
              )}
            </div>

            <div className="space-y-1 flex-1">
              <Label htmlFor="last_name" className="text-sm font-medium text-gray-700">
                Last Name <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  id="last_name"
                  type="text"
                  placeholder="Doe"
                  className={`pl-10 h-11 border-2 focus:border-emerald-500 ${
                    signupFormik.touched.last_name && signupFormik.errors.last_name ? 'border-red-500' : ''
                  }`}
                  {...signupFormik.getFieldProps('last_name')}
                />
              </div>
              {signupFormik.touched.last_name && signupFormik.errors.last_name && (
                <p className="text-xs text-red-500">{signupFormik.errors.last_name}</p>
              )}
            </div>
          </div>
        )}

        {/* Email + Phone */}
        <div className={`${mode === 'signup' ? 'grid grid-cols-1 sm:grid-cols-2 gap-2.5' : ''}`}>
          <div className="space-y-1 flex-1">
            <Label htmlFor="email" className="text-sm font-medium text-gray-700">
              Email Address <span className="text-red-500">*</span>
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                className={`pl-10 h-11 border-2 focus:border-emerald-500 ${
                  formik.touched.email && formik.errors.email ? 'border-red-500' : ''
                }`}
                {...formik.getFieldProps('email')}
              />
            </div>
            {formik.touched.email && formik.errors.email && (
              <p className="text-xs text-red-500">{formik.errors.email}</p>
            )}
          </div>

          {mode === 'signup' && (
            <div className="space-y-1 flex-1">
              <Label htmlFor="phone" className="text-sm font-medium text-gray-700">
                Phone Number <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+1234567890"
                  className={`pl-10 h-11 border-2 focus:border-emerald-500 ${
                    signupFormik.touched.phone && signupFormik.errors.phone ? 'border-red-500' : ''
                  }`}
                  {...signupFormik.getFieldProps('phone')}
                />
              </div>
              {signupFormik.touched.phone && signupFormik.errors.phone && (
                <p className="text-xs text-red-500">{signupFormik.errors.phone}</p>
              )}
            </div>
          )}
        </div>

        {/* Country + Password */}
        <div className={`${mode === 'signup' ? 'grid grid-cols-1 sm:grid-cols-2 gap-2.5' : ''}`}>
          {mode === 'signup' && (
            <div className="space-y-1 flex-1">
              <Label htmlFor="country" className="text-sm font-medium text-gray-700">
                Country <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  id="country"
                  type="text"
                  placeholder="USA"
                  className={`pl-10 h-11 border-2 focus:border-emerald-500 ${
                    signupFormik.touched.country && signupFormik.errors.country ? 'border-red-500' : ''
                  }`}
                  {...signupFormik.getFieldProps('country')}
                />
              </div>
              {signupFormik.touched.country && signupFormik.errors.country && (
                <p className="text-xs text-red-500">{signupFormik.errors.country}</p>
              )}
            </div>
          )}

          <div className="space-y-1 flex-1">
            <Label htmlFor="password" className="text-sm font-medium text-gray-700">
              Password <span className="text-red-500">*</span>
            </Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                className={`pl-10 pr-10 h-11 border-2 focus:border-emerald-500 ${
                  formik.touched.password && formik.errors.password ? 'border-red-500' : ''
                }`}
                {...formik.getFieldProps('password')}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {formik.touched.password && formik.errors.password && (
              <p className="text-xs text-red-500">{formik.errors.password}</p>
            )}
          </div>
        </div>

        {/* Confirm Password */}
        {mode === 'signup' && (
          <div className="space-y-1">
            <Label htmlFor="password_confirmation" className="text-sm font-medium text-gray-700">
              Confirm Password <span className="text-red-500">*</span>
            </Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                id="password_confirmation"
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="••••••••"
                className={`pl-10 pr-10 h-11 border-2 focus:border-emerald-500 ${
                  signupFormik.touched.password_confirmation && signupFormik.errors.password_confirmation
                    ? 'border-red-500'
                    : ''
                }`}
                {...signupFormik.getFieldProps('password_confirmation')}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {signupFormik.touched.password_confirmation && signupFormik.errors.password_confirmation && (
              <p className="text-xs text-red-500">{signupFormik.errors.password_confirmation}</p>
            )}
          </div>
        )}

        {/* Agency Profile Fields */}
        {mode === 'signup' && profileType === 'agency' && (
          <div className="space-y-3 pt-1">
            <div className="flex items-center gap-2 pb-1 border-b border-gray-100">
              <Building2 className="w-4 h-4 text-emerald-600" />
              <h4 className="text-sm font-semibold text-gray-700">Agency Details</h4>
            </div>

            <div className="space-y-1">
              <Label htmlFor="agency_name" className="text-sm font-medium text-gray-700">
                Agency Name <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  id="agency_name"
                  type="text"
                  placeholder="My Travel Agency"
                  className={`pl-10 h-11 border-2 focus:border-emerald-500 ${
                    signupFormik.touched.agency_name && signupFormik.errors.agency_name ? 'border-red-500' : ''
                  }`}
                  {...signupFormik.getFieldProps('agency_name')}
                />
              </div>
              {signupFormik.touched.agency_name && signupFormik.errors.agency_name && (
                <p className="text-xs text-red-500">{signupFormik.errors.agency_name}</p>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div className="space-y-1">
                <Label htmlFor="tax_id" className="text-sm font-medium text-gray-700">
                  Tax ID <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    id="tax_id"
                    type="text"
                    placeholder="TX-123456"
                    className={`pl-10 h-11 border-2 focus:border-emerald-500 ${
                      signupFormik.touched.tax_id && signupFormik.errors.tax_id ? 'border-red-500' : ''
                    }`}
                    {...signupFormik.getFieldProps('tax_id')}
                  />
                </div>
                {signupFormik.touched.tax_id && signupFormik.errors.tax_id && (
                  <p className="text-xs text-red-500">{signupFormik.errors.tax_id}</p>
                )}
              </div>

              <div className="space-y-1">
                <Label htmlFor="website" className="text-sm font-medium text-gray-700">
                  Website <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    id="website"
                    type="url"
                    placeholder="https://myagency.com"
                    className={`pl-10 h-11 border-2 focus:border-emerald-500 ${
                      signupFormik.touched.website && signupFormik.errors.website ? 'border-red-500' : ''
                    }`}
                    {...signupFormik.getFieldProps('website')}
                  />
                </div>
                {signupFormik.touched.website && signupFormik.errors.website && (
                  <p className="text-xs text-red-500">{signupFormik.errors.website}</p>
                )}
              </div>
            </div>

            {/* Host Profile Fields */}
            <div className="flex items-center gap-2 pb-1 border-b border-gray-100 mt-2">
              <Briefcase className="w-4 h-4 text-emerald-600" />
              <h4 className="text-sm font-semibold text-gray-700">Host Profile</h4>
            </div>

            <div className="space-y-1">
              <Label htmlFor="business_name" className="text-sm font-medium text-gray-700">
                Business Name <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  id="business_name"
                  type="text"
                  placeholder="My Business Ltd."
                  className={`pl-10 h-11 border-2 focus:border-emerald-500 ${
                    signupFormik.touched.business_name && signupFormik.errors.business_name ? 'border-red-500' : ''
                  }`}
                  {...signupFormik.getFieldProps('business_name')}
                />
              </div>
              {signupFormik.touched.business_name && signupFormik.errors.business_name && (
                <p className="text-xs text-red-500">{signupFormik.errors.business_name}</p>
              )}
            </div>

            <div className="space-y-1">
              <Label htmlFor="business_registration_number" className="text-sm font-medium text-gray-700">
                Business Registration Number <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  id="business_registration_number"
                  type="text"
                  placeholder="REG-123456789"
                  className={`pl-10 h-11 border-2 focus:border-emerald-500 ${
                    signupFormik.touched.business_registration_number && signupFormik.errors.business_registration_number ? 'border-red-500' : ''
                  }`}
                  {...signupFormik.getFieldProps('business_registration_number')}
                />
              </div>
              {signupFormik.touched.business_registration_number && signupFormik.errors.business_registration_number && (
                <p className="text-xs text-red-500">{signupFormik.errors.business_registration_number}</p>
              )}
            </div>

            <div className="space-y-1">
              <Label htmlFor="bio" className="text-sm font-medium text-gray-700">
                Bio <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <FileText className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <textarea
                  id="bio"
                  rows={3}
                  placeholder="Tell us about your business..."
                  className={`w-full pl-10 pr-3 py-2 border-2 rounded-md text-sm focus:outline-none focus:border-emerald-500 resize-none ${
                    signupFormik.touched.bio && signupFormik.errors.bio ? 'border-red-500' : 'border-input'
                  }`}
                  {...signupFormik.getFieldProps('bio')}
                />
              </div>
              {signupFormik.touched.bio && signupFormik.errors.bio && (
                <p className="text-xs text-red-500">{signupFormik.errors.bio}</p>
              )}
            </div>
          </div>
        )}

        {/* Remember Me / Terms */}
        {mode === 'login' ? (
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="rememberMe"
                checked={loginFormik.values.rememberMe}
                onCheckedChange={(checked) => loginFormik.setFieldValue('rememberMe', checked)}
              />
              <Label htmlFor="rememberMe" className="text-sm text-gray-600 cursor-pointer">
                Remember me
              </Label>
            </div>
            <Link href="/forgot-password" className="text-sm text-emerald-600 hover:text-emerald-700 font-medium">
              Forgot password?
            </Link>
          </div>
        ) : (
          <>
            <div className={`rounded-xl border p-3.5 transition-colors ${
              signupFormik.touched.agreeToTerms && signupFormik.errors.agreeToTerms
                ? 'border-red-300 bg-red-50'
                : signupFormik.values.agreeToTerms
                ? 'border-emerald-300 bg-emerald-50'
                : 'border-gray-200 bg-gray-50'
            }`}>
              <div className="flex items-start gap-3">
                <Checkbox
                  id="agreeToTerms"
                  checked={signupFormik.values.agreeToTerms}
                  onCheckedChange={(checked) => signupFormik.setFieldValue('agreeToTerms', checked)}
                  className="shrink-0 mt-0.5"
                />
                <Label htmlFor="agreeToTerms" className="text-sm text-gray-700 cursor-pointer leading-relaxed">
                  I agree to the{' '}
                  <Link href="/terms" className="text-emerald-600 hover:text-emerald-700 font-semibold underline underline-offset-2">
                    Terms of Service
                  </Link>
                  {' '}and{' '}
                  <Link href="/privacy" className="text-emerald-600 hover:text-emerald-700 font-semibold underline underline-offset-2">
                    Privacy Policy
                  </Link>
                </Label>
              </div>
              {signupFormik.touched.agreeToTerms && signupFormik.errors.agreeToTerms && (
                <p className="text-xs text-red-500 mt-2 ml-7">{signupFormik.errors.agreeToTerms}</p>
              )}
            </div>
          </>
        )}

        {/* Submit Button */}
        <Button
          type="submit"
          className="w-full h-11 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold shadow-lg shadow-emerald-600/30 mt-2"
          disabled={formik.isSubmitting}
        >
          {formik.isSubmitting ? (
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Processing...
            </div>
          ) : (
            <div className="flex items-center gap-2">
              {mode === 'login' ? 'Login' : 'Create Account'}
              <ArrowRight className="w-5 h-5" />
            </div>
          )}
        </Button>
      </form>

      {/* Toggle Mode */}
      {onToggleMode && (
        <div className="mt-5 text-center">
          <p className="text-sm text-gray-600">
            {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
            <button
              type="button"
              onClick={onToggleMode}
              className="text-emerald-600 hover:text-emerald-700 font-semibold"
            >
              {mode === 'login' ? 'Sign up' : 'Login'}
            </button>
          </p>
        </div>
      )}
    </div>
  );
}

import { useState, useEffect } from "react";
import {FiUser,FiMail,
FiPhone,FiMapPin,FiBriefcase,FiCalendar,FiEdit2,FiSave,
FiX,FiCamera,FiShield,FiHome,FiCheckCircle,FiClock,
FiHeart,FiFileText,FiBookOpen,FiLock,
} from "react-icons/fi";
import PageLayout from "../components/layout/PageLayout";
import ProtectedRoute from "../components/auth/ProtectedRoute";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import { useAuth } from "../hooks/useAuth";
import api from "../services/api";

function ProfileContent() {
  const { user, setUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [message, setMessage] = useState({ type: "", text: "" });
  
  // Form state
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    address: "",
    district: "",
    panchayat: "",
    gender: "",
    dob: "",
    occupation: "",
  });

  // Password change state
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordLoading, setPasswordLoading] = useState(false);

  // Occupation options
  const occupationOptions = [
    { value: "farmer", label: "Farmer" },
    { value: "teacher", label: "Teacher" },
    { value: "doctor", label: "Doctor" },
    { value: "engineer", label: "Engineer" },
    { value: "business", label: "Business Owner" },
    { value: "student", label: "Student" },
    { value: "government_employee", label: "Government Employee" },
    { value: "private_employee", label: "Private Employee" },
    { value: "self_employed", label: "Self Employed" },
    { value: "housewife", label: "Housewife" },
    { value: "retired", label: "Retired" },
    { value: "unemployed", label: "Unemployed" },
    { value: "other", label: "Other" },
  ];

  // Gender options
  const genderOptions = [
    { value: "Male", label: "Male" },
    { value: "Female", label: "Female" },
    { value: "Other", label: "Other" },
  ];

  // Format date to DD/MM/YYYY
  const formatDateToDDMMYYYY = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "";
    
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    
    return `${day}/${month}/${year}`;
  };

  // FIXED: Get image URL
  const getImageUrl = (path) => {
    if (!path) return null;
    
    // If path already starts with http, return as is
    if (path.startsWith('http://') || path.startsWith('https://')) {
      return path;
    }
    
    // Get the base URL without /api
    const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
    const baseUrlWithoutApi = baseUrl.replace('/api', '');
    
    // If path starts with /uploads, use the backend URL
    if (path.startsWith('/uploads')) {
      return `${baseUrlWithoutApi}${path}`;
    }
    
    // Otherwise, assume it's just the filename
    return `${baseUrlWithoutApi}/uploads/profiles/${path}`;
  };

  // Load user data into form
  useEffect(() => {
    if (user) {
      console.log("User data:", user);
      console.log("Profile image path:", user.profileImage);
      
      setFormData({
        fullName: user.fullName || "",
        phone: user.phone || "",
        address: user.address || "",
        district: user.district || "",
        panchayat: user.panchayat || "",
        gender: user.gender || "",
        dob: user.dob ? user.dob.split('T')[0] : "",
        occupation: user.occupation || "",
      });
      
      // Set image preview if profile image exists
      if (user.profileImage) {
        const imageUrl = getImageUrl(user.profileImage);
        console.log("Image URL:", imageUrl);
        setImagePreview(imageUrl);
      } else {
        setImagePreview(null);
      }
    }
  }, [user]);

  // Get user initials for avatar
  const getUserInitials = () => {
    if (formData.fullName) {
      return formData.fullName
        .split(" ")
        .map((name) => name[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
    }
    return "U";
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const response = await api.put("/profile", formData);
      
      if (setUser && response.data.user) {
        setUser(response.data.user);
      }
      
      setMessage({
        type: "success",
        text: "Profile updated successfully!",
      });
      
      setIsEditing(false);
      
      setTimeout(() => setMessage({ type: "", text: "" }), 3000);
    } catch (error) {
      setMessage({
        type: "error",
        text: error.response?.data?.message || "Failed to update profile",
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage({
        type: "error",
        text: "New passwords do not match",
      });
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setMessage({
        type: "error",
        text: "Password must be at least 6 characters long",
      });
      return;
    }

    setPasswordLoading(true);
    setMessage({ type: "", text: "" });

    try {
      await api.put("/profile/password", {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });
      
      setMessage({
        type: "success",
        text: "Password changed successfully!",
      });
      
      setShowPasswordModal(false);
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      
      setTimeout(() => setMessage({ type: "", text: "" }), 3000);
    } catch (error) {
      setMessage({
        type: "error",
        text: error.response?.data?.message || "Failed to change password",
      });
    } finally {
      setPasswordLoading(false);
    }
  };

  // FIXED: Profile Photo Upload Function
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    console.log("File selected:", file.name, file.type, file.size);

    // Validate file size (2MB)
    if (file.size > 2 * 1024 * 1024) {
      setMessage({
        type: "error",
        text: "File size must be less than 2MB",
      });
      return;
    }

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      setMessage({
        type: "error",
        text: "Only JPEG, PNG, JPG, and WEBP images are allowed",
      });
      return;
    }

    // Show preview immediately
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);

    const formData = new FormData();
    formData.append("profileImage", file);

    setImageLoading(true);
    setMessage({ type: "", text: "" });

    try {
      console.log("Sending request to /profile/photo");
      
      const response = await api.post("/profile/photo", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      
      console.log("Upload success:", response.data);
      
      // Update user context with new profile image
      if (setUser && response.data.profileImage) {
        setUser({ ...user, profileImage: response.data.profileImage });
        const imageUrl = getImageUrl(response.data.profileImage);
        setImagePreview(imageUrl);
      }
      
      setMessage({
        type: "success",
        text: "Profile photo updated successfully!",
      });
      
      setTimeout(() => setMessage({ type: "", text: "" }), 3000);
    } catch (error) {
      console.error("Upload error:", error);
      
      // Revert preview on error
      if (user?.profileImage) {
        const imageUrl = getImageUrl(user.profileImage);
        setImagePreview(imageUrl);
      } else {
        setImagePreview(null);
      }
      
      let errorMessage = "Failed to upload photo. ";
      if (error.response?.data?.message) {
        errorMessage += error.response.data.message;
      } else if (error.response?.status === 401) {
        errorMessage += "Please login again.";
      } else if (error.response?.status === 413) {
        errorMessage += "File too large (max 2MB).";
      } else if (error.response?.status === 404) {
        errorMessage += "API endpoint not found. Please check backend route.";
      } else if (error.code === "ECONNREFUSED") {
        errorMessage += "Cannot connect to server. Is backend running?";
      } else {
        errorMessage += "Please try again.";
      }
      
      setMessage({
        type: "error",
        text: errorMessage,
      });
    } finally {
      setImageLoading(false);
    }
  };

  const handleCancel = () => {
    if (user) {
      setFormData({
        fullName: user.fullName || "",
        phone: user.phone || "",
        address: user.address || "",
        district: user.district || "",
        panchayat: user.panchayat || "",
        gender: user.gender || "",
        dob: user.dob ? user.dob.split('T')[0] : "",
        occupation: user.occupation || "",
      });
      
      if (user.profileImage) {
        const imageUrl = getImageUrl(user.profileImage);
        setImagePreview(imageUrl);
      } else {
        setImagePreview(null);
      }
    }
    setIsEditing(false);
    setMessage({ type: "", text: "" });
  };

  // Profile statistics
  const stats = [
    { icon: FiFileText, label: "Applications", value: "12", color: "blue" },
    { icon: FiCheckCircle, label: "Approved", value: "8", color: "green" },
    { icon: FiClock, label: "Pending", value: "3", color: "yellow" },
    { icon: FiHeart, label: "Schemes Applied", value: "5", color: "purple" },
  ];

  // User info fields for display
  const infoFields = [
    { icon: FiUser, label: "Full Name", value: formData.fullName },
    { icon: FiMail, label: "Email", value: user?.email },
    { icon: FiPhone, label: "Phone", value: formData.phone },
    { icon: FiMapPin, label: "Address", value: formData.address },
    { icon: FiHome, label: "District", value: formData.district },
    { icon: FiBookOpen, label: "Panchayat", value: formData.panchayat },
    { icon: FiUser, label: "Gender", value: formData.gender ? genderOptions.find(g => g.value === formData.gender)?.label : "" },
    { icon: FiCalendar, label: "Date of Birth", value: formatDateToDDMMYYYY(formData.dob) },
    { icon: FiBriefcase, label: "Occupation", value: formData.occupation ? occupationOptions.find(o => o.value === formData.occupation)?.label : "" },
  ];

  return (
    <PageLayout>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
              <p className="mt-1 text-sm text-gray-500">
                Manage your personal information and preferences
              </p>
            </div>
            {!isEditing && (
              <div className="flex gap-3">
                <Button
                  onClick={() => setShowPasswordModal(true)}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <FiLock className="h-4 w-4" />
                  Change Password
                </Button>
                <Button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-2"
                >
                  <FiEdit2 className="h-4 w-4" />
                  Edit Profile
                </Button>
              </div>
            )}
          </div>

          {/* Message Alert */}
          {message.text && (
            <div
              className={`mb-6 rounded-lg p-4 ${
                message.type === "success"
                  ? "bg-green-50 text-green-800 border border-green-200"
                  : "bg-red-50 text-red-800 border border-red-200"
              }`}
            >
              <div className="flex items-center gap-2">
                {message.type === "success" ? (
                  <FiCheckCircle className="h-5 w-5" />
                ) : (
                  <FiX className="h-5 w-5" />
                )}
                {message.text}
              </div>
            </div>
          )}

          {/* Profile Header Card */}
          <div className="mb-8 overflow-hidden rounded-xl bg-white shadow-sm">
            <div className="relative h-32 bg-gradient-to-r from-blue-500 to-blue-600">
              <div className="absolute -bottom-12 left-8 flex items-end gap-4">
                <div className="relative">
                  <div className="relative h-24 w-24">
                    {/* Profile Image / Avatar - FIXED */}
                    <div className="flex h-full w-full items-center justify-center rounded-full border-4 border-white bg-gradient-to-br from-blue-400 to-blue-600 text-3xl font-bold text-white shadow-lg overflow-hidden">
                      {imagePreview ? (
                        <img
                          src={imagePreview}
                          alt="Profile"
                          className="h-full w-full object-cover"
                          onError={(e) => {
                            console.error("Image failed to load:", imagePreview);
                            e.target.style.display = 'none';
                            setImagePreview(null);
                          }}
                        />
                      ) : (
                        <span>{getUserInitials()}</span>
                      )}
                    </div>
                    
                    {/* Upload Button */}
                    {isEditing && (
                      <label
                        htmlFor="profileImage"
                        className="absolute bottom-0 right-0 cursor-pointer rounded-full bg-white p-1.5 shadow-md transition-all hover:scale-110 hover:bg-gray-50"
                        title="Upload new photo"
                      >
                        <FiCamera className="h-4 w-4 text-gray-600" />
                        <input
                          id="profileImage"
                          type="file"
                          accept="image/jpeg,image/png,image/jpg,image/webp"
                          className="hidden"
                          onChange={handleImageUpload}
                          disabled={imageLoading}
                        />
                      </label>
                    )}
                    
                    {/* Loading Overlay */}
                    {imageLoading && (
                      <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black bg-opacity-50">
                        <div className="h-8 w-8 animate-spin rounded-full border-4 border-white border-t-transparent"></div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="px-8 pb-6 pt-16">
              <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-start">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {formData.fullName || "Not Provided"}
                  </h2>
                  <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <FiShield className="h-4 w-4" />
                      {user?.role || "Citizen"}
                    </span>
                    <span className="hidden sm:inline">•</span>
                    <span className="flex items-center gap-1">
                      <FiCalendar className="h-4 w-4" />
                      Member since {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : "N/A"}
                    </span>
                    {formData.district && (
                      <>
                        <span className="hidden sm:inline">•</span>
                        <span className="flex items-center gap-1">
                          <FiMapPin className="h-4 w-4" />
                          {formData.district}
                        </span>
                      </>
                    )}
                  </div>
                </div>
                {!isEditing && (
                  <span className="inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-800">
                    <span className="mr-1.5 h-2 w-2 rounded-full bg-green-500"></span>
                    Active
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="rounded-lg bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="flex items-center gap-3">
                  <div className={`rounded-lg bg-${stat.color}-50 p-2 text-${stat.color}-600`}>
                    <stat.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">{stat.label}</p>
                    <p className="text-xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Profile Form/Display */}
          <div className="rounded-xl bg-white shadow-sm">
            <div className="border-b border-gray-200 px-6 py-4">
              <h3 className="text-lg font-semibold text-gray-900">
                {isEditing ? "Edit Personal Information" : "Personal Information"}
              </h3>
            </div>
            <div className="p-6">
              {isEditing ? (
                <form onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    {/* Full Name */}
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-gray-700">
                        Full Name *
                      </label>
                      <Input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        placeholder="Enter your full name"
                        className="w-full"
                        required
                      />
                    </div>

                    {/* Phone */}
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-gray-700">
                        Phone Number *
                      </label>
                      <Input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="Enter your phone number"
                        className="w-full"
                        required
                      />
                    </div>

                    {/* Gender Dropdown */}
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-gray-700">
                        Gender
                      </label>
                      <select
                        name="gender"
                        value={formData.gender}
                        onChange={handleInputChange}
                        className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                      >
                        <option value="">Select Gender</option>
                        {genderOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Date of Birth */}
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-gray-700">
                        Date of Birth
                      </label>
                      <Input
                        type="date"
                        name="dob"
                        value={formData.dob}
                        onChange={handleInputChange}
                        className="w-full"
                      />
                    </div>

                    {/* Occupation Dropdown */}
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-gray-700">
                        Occupation
                      </label>
                      <select
                        name="occupation"
                        value={formData.occupation}
                        onChange={handleInputChange}
                        className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                      >
                        <option value="">Select Occupation</option>
                        {occupationOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Address */}
                    <div className="md:col-span-2">
                      <label className="mb-1.5 block text-sm font-medium text-gray-700">
                        Address
                      </label>
                      <textarea
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        rows={2}
                        placeholder="Enter your complete address"
                        className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                      />
                    </div>

                    {/* District */}
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-gray-700">
                        District
                      </label>
                      <Input
                        type="text"
                        name="district"
                        value={formData.district}
                        onChange={handleInputChange}
                        placeholder="Enter your district"
                        className="w-full"
                      />
                    </div>

                    {/* Panchayat */}
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-gray-700">
                        Panchayat
                      </label>
                      <Input
                        type="text"
                        name="panchayat"
                        value={formData.panchayat}
                        onChange={handleInputChange}
                        placeholder="Enter your panchayat"
                        className="w-full"
                      />
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="mt-8 flex flex-col gap-3 border-t border-gray-200 pt-6 sm:flex-row sm:justify-end">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleCancel}
                      className="flex items-center justify-center gap-2"
                    >
                      <FiX className="h-4 w-4" />
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={loading}
                      className="flex items-center justify-center gap-2"
                    >
                      <FiSave className="h-4 w-4" />
                      {loading ? "Saving..." : "Save Changes"}
                    </Button>
                  </div>
                </form>
              ) : (
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  {infoFields.map((field, index) => (
                    field.value && (
                      <div key={index} className="flex items-start gap-3">
                        <div className="mt-0.5 rounded-lg bg-gray-100 p-2 text-gray-600">
                          <field.icon className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-500">{field.label}</p>
                          <p className="text-gray-900">{field.value}</p>
                        </div>
                      </div>
                    )
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Password Change Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="w-full max-w-md rounded-xl bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
              <h3 className="text-lg font-semibold text-gray-900">Change Password</h3>
              <button
                onClick={() => setShowPasswordModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <FiX className="h-6 w-6" />
              </button>
            </div>
            <form onSubmit={handlePasswordSubmit} className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">
                    Current Password *
                  </label>
                  <Input
                    type="password"
                    name="currentPassword"
                    value={passwordData.currentPassword}
                    onChange={handlePasswordChange}
                    placeholder="Enter current password"
                    className="w-full"
                    required
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">
                    New Password *
                  </label>
                  <Input
                    type="password"
                    name="newPassword"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    placeholder="Enter new password (min 6 characters)"
                    className="w-full"
                    required
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">
                    Confirm New Password *
                  </label>
                  <Input
                    type="password"
                    name="confirmPassword"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                    placeholder="Confirm new password"
                    className="w-full"
                    required
                  />
                </div>
              </div>
              <div className="mt-6 flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowPasswordModal(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={passwordLoading}
                  className="flex-1"
                >
                  {passwordLoading ? "Changing..." : "Change Password"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </PageLayout>
  );
}

function Profile() {
  return (
    <ProtectedRoute>
      <ProfileContent />
    </ProtectedRoute>
  );
}

export default Profile;
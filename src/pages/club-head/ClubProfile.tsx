import  { useEffect, useState } from "react";
import {
  doc,
  getDoc,
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  setDoc
} from "firebase/firestore";
import { db } from "../../firebase";
import { Pencil, Trash2, PlusCircle, XCircle, CheckCircle, Edit, Save, X } from "lucide-react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useAuth } from "../../contexts/AuthContext";

interface ClubData {
  name: string;
  description: string;
  domain: string;
  establishedYear: string;
  clubHeadName: string;
  email: string;
  instagram?: string;
  linkedin?: string;
  logoURL?: string;
  bannerURL?: string;
  contact?: string;
  website?: string;
  facebook?: string;
  twitter?: string;
  address?: string;
  followersCount?: number; // Added followersCount field
}

interface EBMember {
  id: string;
  name: string;
  role: string;
  email?: string;
  contact?: string;
}

const ClubProfile = () => {
  const { user, updateUserProfile } = useAuth();
  const [clubData, setClubData] = useState<ClubData | null>(null);
  const [editClubData, setEditClubData] = useState<ClubData | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [ebMembers, setEbMembers] = useState<EBMember[]>([]);
  const [memberForm, setMemberForm] = useState<Partial<EBMember>>({
    name: "",
    role: "",
    email: "",
    contact: "",
  });
  const [editMemberId, setEditMemberId] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [clubId, setClubId] = useState<string | null>(null);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setClubId(user.uid);
      } else {
        setClubId(null);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (clubId) {
      fetchClubData(clubId);
      fetchEbMembers(clubId);
    }
  }, [clubId]);

  const fetchClubData = async (id: string) => {
    setLoading(true);
    try {
      const clubRef = doc(db, "clubs", id);
      const clubSnap = await getDoc(clubRef);
      if (clubSnap.exists()) {
        const data = clubSnap.data() as ClubData;
        setClubData(data);
        setEditClubData({...data});
      } else {
        // Check if there's locally saved data
        const localData = localStorage.getItem(`club_profile_${id}`);
        if (localData) {
          try {
            const parsedData = JSON.parse(localData);
            setClubData(parsedData);
            setEditClubData(parsedData);
            console.log('Loaded club data from localStorage');
            setLoading(false);
            return;
          } catch (parseError) {
            console.error('Error parsing local club data:', parseError);
          }
        }
        
        // Set default empty data if no profile exists and create it in Firestore
        const defaultData: ClubData = {
          name: user?.name || '',
          description: '',
          domain: '',
          establishedYear: new Date().getFullYear().toString(),
          clubHeadName: user?.name || '',
          email: user?.email || '',
          instagram: '',
          linkedin: '',
          logoURL: '',
          bannerURL: '',
          contact: '',
          website: '',
          facebook: '',
          twitter: '',
          address: '',
          followersCount: 0 // Added default followersCount
        };
        
        // Create the default profile in Firestore
        try {
          await setDoc(clubRef, defaultData);
          console.log('Default club profile created for club:', id);
        } catch (createError) {
          console.error('Error creating default club profile:', createError);
        }
        
        setClubData(defaultData);
        setEditClubData(defaultData);
        console.warn("No club found for id, created default:", id);
      }
    } catch (error) {
      console.error("Error fetching club data:", error);
      
      // Check if there's locally saved data as a fallback
      const localData = localStorage.getItem(`club_profile_${id}`);
      if (localData) {
        try {
          const parsedData = JSON.parse(localData);
          setClubData(parsedData);
          setEditClubData(parsedData);
          console.log('Loaded club data from localStorage after error');
          setLoading(false);
          return;
        } catch (parseError) {
          console.error('Error parsing local club data:', parseError);
        }
      }
      
      // Even if there's an error, set default data to prevent "No club data found"
      const defaultData: ClubData = {
        name: user?.name || '',
        description: '',
        domain: '',
        establishedYear: new Date().getFullYear().toString(),
        clubHeadName: user?.name || '',
        email: user?.email || '',
        instagram: '',
        linkedin: '',
        logoURL: '',
        bannerURL: '',
        contact: '',
        website: '',
        facebook: '',
        twitter: '',
        address: '',
        followersCount: 0 // Added default followersCount
      };
      setClubData(defaultData);
      setEditClubData(defaultData);
    } finally {
      setLoading(false);
    }
  };

  const fetchEbMembers = async (id: string) => {
    try {
      const ebRef = collection(db, "clubs", id, "ebMembers");
      const ebSnap = await getDocs(ebRef);
      const members: EBMember[] = ebSnap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as EBMember[];
      setEbMembers(members);
    } catch (error) {
      console.error("Error fetching EB members:", error);
      setEbMembers([]);
    }
  };

  // Form validation helper
  const validateForm = () => {
    if (!memberForm.name?.trim()) {
      setFormError("Name is required");
      return false;
    }
    if (!memberForm.role?.trim()) {
      setFormError("Role is required");
      return false;
    }
    setFormError(null);
    return true;
  };

  // Add new EB member
  const handleAddMember = async () => {
    if (!clubId) return;
    if (!validateForm()) return;

    try {
      const ebRef = collection(db, "clubs", clubId, "ebMembers");
      await addDoc(ebRef, {
        name: memberForm.name,
        role: memberForm.role,
        email: memberForm.email || "",
        contact: memberForm.contact || "",
      });
      await fetchEbMembers(clubId);
      setMemberForm({ name: "", role: "", email: "", contact: "" });
    } catch (error) {
      console.error("Error adding EB member:", error);
    }
  };

  // Start editing an EB member
  const handleEditMember = (member: EBMember) => {
    setEditMemberId(member.id);
    setMemberForm({
      name: member.name,
      role: member.role,
      email: member.email || "",
      contact: member.contact || "",
    });
    setFormError(null);
  };

  // Cancel editing
  const cancelEdit = () => {
    setEditMemberId(null);
    setMemberForm({ name: "", role: "", email: "", contact: "" });
    setFormError(null);
  };

  // Save edited EB member
  const handleSaveMember = async () => {
    if (!clubId || !editMemberId) return;
    if (!validateForm()) return;

    try {
      const memberDocRef = doc(db, "clubs", clubId, "ebMembers", editMemberId);
      await updateDoc(memberDocRef, {
        name: memberForm.name,
        role: memberForm.role,
        email: memberForm.email || "",
        contact: memberForm.contact || "",
      });
      await fetchEbMembers(clubId);
      cancelEdit();
    } catch (error) {
      console.error("Error updating EB member:", error);
    }
  };

  // Delete EB member
  const handleDeleteMember = async (id: string) => {
    if (!clubId) return;
    if (!window.confirm("Are you sure you want to delete this member?")) return;

    try {
      const memberDocRef = doc(db, "clubs", clubId, "ebMembers", id);
      await deleteDoc(memberDocRef);
      await fetchEbMembers(clubId);
    } catch (error) {
      console.error("Error deleting EB member:", error);
    }
  };

  // Save club data
  const handleSaveClubData = async () => {
    if (!clubId || !editClubData) return;

    try {
      const clubRef = doc(db, "clubs", clubId);
      await updateDoc(clubRef, {
        ...editClubData,
      });
      
      // Update local state
      setClubData(editClubData);
      setIsEditing(false);
      
      // Update user profile if needed and if updateUserProfile exists
      if (user && updateUserProfile) {
        try {
          await updateUserProfile({
            ...user,
            name: editClubData.name,
            email: editClubData.email,
            avatar: editClubData.logoURL || '',
          });
        } catch (error) {
          console.error("Error updating user profile:", error);
        }
      }
    } catch (error) {
      console.error("Error saving club data:", error);
    }
  };

  // Cancel club edit
  const handleCancelEdit = () => {
    setEditClubData(clubData ? {...clubData} : null);
    setIsEditing(false);
  };

  if (loading) {
    return (
      <div className="p-4">
        <p>Loading club data...</p>
      </div>
    );
  }

  if (!clubData || !editClubData) {
    return (
      <div className="p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-500">Setting up your club profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      {/* Banner Image */}
      <div className="relative h-48 md:h-64 rounded-t-lg overflow-hidden -mx-6 -mt-6">
        {isEditing ? (
          <input
            type="text"
            value={editClubData.bannerURL || ""}
            onChange={(e) => setEditClubData({...editClubData, bannerURL: e.target.value})}
            placeholder="Banner Image URL"
            className="w-full h-full px-4 py-2 bg-black bg-opacity-50 text-white placeholder-gray-300"
          />
        ) : (
          <div 
            className="w-full h-full bg-cover bg-center"
            style={{ 
              backgroundImage: clubData.bannerURL 
                ? `url(${clubData.bannerURL})` 
                : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' 
            }}
          >
            <div className="absolute inset-0 bg-black bg-opacity-30"></div>
          </div>
        )}
      </div>
      
      {/* Club Header */}
      <div className="flex items-end gap-4 -mt-16 ml-6 relative z-10">
        {isEditing ? (
          <div className="flex flex-col gap-2">
            <input
              type="text"
              value={editClubData.logoURL || ""}
              onChange={(e) => setEditClubData({...editClubData, logoURL: e.target.value})}
              placeholder="Logo URL"
              className="border rounded px-2 py-1 w-32"
            />
          </div>
        ) : (
          <img
            src={clubData.logoURL || 'https://placehold.co/100x100?text=Logo'}
            alt="Club Logo"
            className="w-32 h-32 rounded-full border-4 border-white shadow-lg object-cover"
          />
        )}
        <div className="pb-4">
          {isEditing ? (
            <input
              type="text"
              value={editClubData.name}
              onChange={(e) => setEditClubData({...editClubData, name: e.target.value})}
              className="text-3xl font-bold border-b border-gray-300 focus:outline-none focus:border-primary-500 w-full"
            />
          ) : (
            <h1 className="text-3xl font-bold">{clubData.name}</h1>
          )}
          <div className="flex items-center gap-2 mt-1">
            {isEditing ? (
              <input
                type="text"
                value={editClubData.domain}
                onChange={(e) => setEditClubData({...editClubData, domain: e.target.value})}
                className="text-gray-600 border-b border-gray-300 focus:outline-none focus:border-primary-500"
              />
            ) : (
              <p className="text-gray-600">{clubData.domain}</p>
            )}
            <span className="text-gray-400">•</span>
            {isEditing ? (
              <input
                type="text"
                value={editClubData.establishedYear}
                onChange={(e) => setEditClubData({...editClubData, establishedYear: e.target.value})}
                className="text-gray-600 border-b border-gray-300 focus:outline-none focus:border-primary-500"
              />
            ) : (
              <p className="text-gray-600">Established {clubData.establishedYear}</p>
            )}
            <span className="text-gray-400">•</span>
            {isEditing ? (
              <input
                type="text"
                value={editClubData.followersCount?.toString() || "0"}
                onChange={(e) => setEditClubData({...editClubData, followersCount: parseInt(e.target.value) || 0})}
                className="text-gray-600 border-b border-gray-300 focus:outline-none focus:border-primary-500"
              />
            ) : (
              <p className="text-gray-600">{clubData.followersCount || 0} followers</p>
            )}
          </div>
        </div>
        <div className="ml-auto pb-4">
          {isEditing ? (
            <div className="flex gap-2">
              <button
                onClick={handleSaveClubData}
                className="inline-flex items-center gap-1 bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 transition text-sm"
              >
                <Save size={16} /> Save
              </button>
              <button
                onClick={handleCancelEdit}
                className="inline-flex items-center gap-1 bg-gray-400 text-white px-3 py-1 rounded hover:bg-gray-500 transition text-sm"
              >
                <X size={16} /> Cancel
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="inline-flex items-center gap-1 bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition text-sm"
            >
              <Edit size={16} /> Edit
            </button>
          )}
        </div>
      </div>

      {/* Club Details */}
      <div className="mt-6 grid gap-4">
        <div>
          <strong>Description:</strong>
          {isEditing ? (
            <textarea
              value={editClubData.description}
              onChange={(e) => setEditClubData({...editClubData, description: e.target.value})}
              className="w-full border rounded p-2 mt-1"
              rows={3}
            />
          ) : (
            <p className="mt-1">{clubData.description}</p>
          )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <strong>Club Head:</strong>
            {isEditing ? (
              <input
                type="text"
                value={editClubData.clubHeadName}
                onChange={(e) => setEditClubData({...editClubData, clubHeadName: e.target.value})}
                className="block w-full border rounded p-2 mt-1"
              />
            ) : (
              <p className="mt-1">{clubData.clubHeadName}</p>
            )}
          </div>
          <div>
            <strong>Email:</strong>
            {isEditing ? (
              <input
                type="email"
                value={editClubData.email}
                onChange={(e) => setEditClubData({...editClubData, email: e.target.value})}
                className="block w-full border rounded p-2 mt-1"
              />
            ) : (
              <p className="mt-1">{clubData.email}</p>
            )}
          </div>
          <div>
            <strong>Contact:</strong>
            {isEditing ? (
              <input
                type="text"
                value={editClubData.contact || ""}
                onChange={(e) => setEditClubData({...editClubData, contact: e.target.value})}
                className="block w-full border rounded p-2 mt-1"
              />
            ) : (
              <p className="mt-1">{clubData.contact || "Not provided"}</p>
            )}
          </div>
          <div>
            <strong>Address:</strong>
            {isEditing ? (
              <input
                type="text"
                value={editClubData.address || ""}
                onChange={(e) => setEditClubData({...editClubData, address: e.target.value})}
                className="block w-full border rounded p-2 mt-1"
              />
            ) : (
              <p className="mt-1">{clubData.address || "Not provided"}</p>
            )}
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <strong>Website:</strong>
            {isEditing ? (
              <input
                type="text"
                value={editClubData.website || ""}
                onChange={(e) => setEditClubData({...editClubData, website: e.target.value})}
                className="block w-full border rounded p-2 mt-1"
                placeholder="https://example.com"
              />
            ) : (
              <p className="mt-1">
                {clubData.website ? (
                  <a
                    href={clubData.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline"
                  >
                    Visit Website
                  </a>
                ) : (
                  "Not provided"
                )}
              </p>
            )}
          </div>
          <div>
            <strong>Instagram:</strong>
            {isEditing ? (
              <input
                type="text"
                value={editClubData.instagram || ""}
                onChange={(e) => setEditClubData({...editClubData, instagram: e.target.value})}
                className="block w-full border rounded p-2 mt-1"
                placeholder="https://instagram.com/username"
              />
            ) : (
              <p className="mt-1">
                {clubData.instagram ? (
                  <a
                    href={clubData.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline"
                  >
                    Visit Instagram
                  </a>
                ) : (
                  "Not provided"
                )}
              </p>
            )}
          </div>
          <div>
            <strong>LinkedIn:</strong>
            {isEditing ? (
              <input
                type="text"
                value={editClubData.linkedin || ""}
                onChange={(e) => setEditClubData({...editClubData, linkedin: e.target.value})}
                className="block w-full border rounded p-2 mt-1"
                placeholder="https://linkedin.com/company/username"
              />
            ) : (
              <p className="mt-1">
                {clubData.linkedin ? (
                  <a
                    href={clubData.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline"
                  >
                    Visit LinkedIn
                  </a>
                ) : (
                  "Not provided"
                )}
              </p>
            )}
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <strong>Facebook:</strong>
            {isEditing ? (
              <input
                type="text"
                value={editClubData.facebook || ""}
                onChange={(e) => setEditClubData({...editClubData, facebook: e.target.value})}
                className="block w-full border rounded p-2 mt-1"
                placeholder="https://facebook.com/username"
              />
            ) : (
              <p className="mt-1">
                {clubData.facebook ? (
                  <a
                    href={clubData.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline"
                  >
                    Visit Facebook
                  </a>
                ) : (
                  "Not provided"
                )}
              </p>
            )}
          </div>
          <div>
            <strong>Twitter:</strong>
            {isEditing ? (
              <input
                type="text"
                value={editClubData.twitter || ""}
                onChange={(e) => setEditClubData({...editClubData, twitter: e.target.value})}
                className="block w-full border rounded p-2 mt-1"
                placeholder="https://twitter.com/username"
              />
            ) : (
              <p className="mt-1">
                {clubData.twitter ? (
                  <a
                    href={clubData.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline"
                  >
                    Visit Twitter
                  </a>
                ) : (
                  "Not provided"
                )}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* EB Members Section */}
      <div className="mt-10">
        <h2 className="text-2xl font-semibold mb-4">Executive Board Members</h2>

        {/* Form to Add/Edit */}
        <div className="border rounded-md p-4 mb-6 bg-white shadow-sm">
          <h3 className="text-lg font-medium mb-3">
            {editMemberId ? "Edit Member" : "Add New Member"}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Name *"
              value={memberForm.name}
              onChange={(e) =>
                setMemberForm((prev) => ({ ...prev, name: e.target.value }))
              }
              className="border rounded px-3 py-2 w-full"
            />
            <input
              type="text"
              placeholder="Role *"
              value={memberForm.role}
              onChange={(e) =>
                setMemberForm((prev) => ({ ...prev, role: e.target.value }))
              }
              className="border rounded px-3 py-2 w-full"
            />
            <input
              type="email"
              placeholder="Email"
              value={memberForm.email}
              onChange={(e) =>
                setMemberForm((prev) => ({ ...prev, email: e.target.value }))
              }
              className="border rounded px-3 py-2 w-full"
            />
            <input
              type="text"
              placeholder="Contact"
              value={memberForm.contact}
              onChange={(e) =>
                setMemberForm((prev) => ({ ...prev, contact: e.target.value }))
              }
              className="border rounded px-3 py-2 w-full"
            />
          </div>

          {formError && (
            <p className="text-red-600 mt-2 font-semibold">{formError}</p>
          )}

          <div className="mt-4 flex gap-3">
            {editMemberId ? (
              <>
                <button
                  onClick={handleSaveMember}
                  className="inline-flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
                >
                  <CheckCircle size={18} /> Save
                </button>
                <button
                  onClick={cancelEdit}
                  className="inline-flex items-center gap-2 bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500 transition"
                >
                  <XCircle size={18} /> Cancel
                </button>
              </>
            ) : (
              <button
                onClick={handleAddMember}
                className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
              >
                <PlusCircle size={18} /> Add Member
              </button>
            )}
          </div>
        </div>

        {/* EB Members List */}
        <ul className="space-y-3">
          {ebMembers.length === 0 && (
            <p className="text-gray-600 italic">No executive board members yet.</p>
          )}

          {ebMembers.map((member) => (
            <li
              key={member.id}
              className="flex items-center justify-between border rounded p-3 bg-white shadow-sm"
            >
              <div>
                <p className="font-semibold">{member.name}</p>
                <p className="text-sm text-gray-600">{member.role}</p>
                {member.email && (
                  <p className="text-sm text-gray-600">Email: {member.email}</p>
                )}
                {member.contact && (
                  <p className="text-sm text-gray-600">Contact: {member.contact}</p>
                )}
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => handleEditMember(member)}
                  title="Edit Member"
                  className="text-blue-600 hover:text-blue-800"
                >
                  <Pencil size={20} />
                </button>
                <button
                  onClick={() => handleDeleteMember(member.id)}
                  title="Delete Member"
                  className="text-red-600 hover:text-red-800"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ClubProfile;
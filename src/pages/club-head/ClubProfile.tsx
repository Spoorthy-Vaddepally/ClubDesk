import  { useEffect, useState } from "react";
import {
  doc,
  getDoc,
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "../../firebase";
import { Pencil, Trash2, PlusCircle, XCircle, CheckCircle } from "lucide-react";
import { getAuth, onAuthStateChanged } from "firebase/auth";

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
}

interface EBMember {
  id: string;
  name: string;
  role: string;
  email?: string;
  contact?: string;
}

const ClubProfile = () => {
  const [clubData, setClubData] = useState<ClubData | null>(null);
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
        setClubData(clubSnap.data() as ClubData);
      } else {
        setClubData(null);
        console.warn("No club found for id:", id);
      }
    } catch (error) {
      console.error("Error fetching club data:", error);
      setClubData(null);
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

  if (loading) {
    return (
      <div className="p-4">
        <p>Loading club data...</p>
      </div>
    );
  }

  if (!clubData) {
    return (
      <div className="p-4">
        <p>No club data found for the logged-in club.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      {/* Club Header */}
      <div className="flex items-center gap-4 border-b pb-4">
        {clubData.logoURL && (
          <img
            src={clubData.logoURL}
            alt="Club Logo"
            className="w-20 h-20 rounded-full object-cover"
          />
        )}
        <div>
          <h1 className="text-3xl font-bold">{clubData.name}</h1>
          <p className="text-gray-600">{clubData.domain}</p>
        </div>
      </div>

      {/* Club Details */}
      <div className="mt-6 grid gap-2 text-gray-800">
        <p>
          <strong>Description:</strong> {clubData.description}
        </p>
        <p>
          <strong>Established:</strong> {clubData.establishedYear}
        </p>
        <p>
          <strong>Club Head:</strong> {clubData.clubHeadName}
        </p>
        <p>
          <strong>Email:</strong> {clubData.email}
        </p>
        {clubData.instagram && (
          <p>
            <strong>Instagram:</strong>{" "}
            <a
              href={clubData.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline"
            >
              Visit
            </a>
          </p>
        )}
        {clubData.linkedin && (
          <p>
            <strong>LinkedIn:</strong>{" "}
            <a
              href={clubData.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline"
            >
              Visit
            </a>
          </p>
        )}
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

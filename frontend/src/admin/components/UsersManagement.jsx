import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { fetchUsers, deleteUser as deleteUserApi } from "../../api/usersApi";

const UsersManagement = () => {
  const [buyers, setBuyers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const users = await fetchUsers();
      // Filter out admin users, only show buyers
      const buyerUsers = users.filter(user => user.role === 'buyer');
      setBuyers(buyerUsers);
    } catch (error) {
      console.error("Failed to load users:", error);
      toast.error("Failed to load users");
      // Fallback to localStorage
      const savedBuyers = JSON.parse(localStorage.getItem("buyers") || "[]");
      setBuyers(savedBuyers);
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (userId, email) => {
    if (window.confirm(`Are you sure you want to delete user ${email}?`)) {
      try {
        await deleteUserApi(userId);
        await loadUsers(); // Reload users
        toast.success("User deleted successfully!");
      } catch (error) {
        console.error("Failed to delete user:", error);
        toast.error("Failed to delete user");
        // Fallback to local update
        const updated = buyers.filter((b) => b.email !== email);
        setBuyers(updated);
        localStorage.setItem("buyers", JSON.stringify(updated));
        toast.success("User deleted (local)");
      }
    }
  };

  const filteredBuyers = buyers.filter((buyer) =>
    buyer.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    buyer.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">👥 Users Management</h2>
        <div className="text-sm text-gray-600">
          Total Users: <span className="font-bold">{buyers.length}</span>
        </div>
      </div>

      {/* Search */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search users by name or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full max-w-md px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
        />
      </div>

      {/* Users Table */}
      {loading ? (
        <div className="bg-white shadow rounded-lg p-8 text-center text-gray-500">
          Loading users...
        </div>
      ) : (
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-green-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Phone</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Address</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredBuyers.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                    No users found
                  </td>
                </tr>
              ) : (
                filteredBuyers.map((buyer) => (
                  <tr key={buyer._id || buyer.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{buyer.name || "N/A"}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{buyer.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{buyer.phone || "N/A"}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-500 max-w-xs truncate">
                        {buyer.address && buyer.address.street ? (
                          typeof buyer.address === 'string' 
                            ? buyer.address 
                            : `${buyer.address.street}, ${buyer.address.city || ''}, ${buyer.address.state || ''}`
                        ) : buyer.phone ? "No address" : "N/A"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => deleteUser(buyer._id || buyer.id, buyer.email)}
                        className="text-red-600 hover:text-red-800 text-sm font-medium"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default UsersManagement;


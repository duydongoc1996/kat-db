import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';
import { useBaby } from '../contexts/BabyContext';
import { supabase } from '../lib/supabase';

export default function BabyManagementPage() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { babies, currentBaby, createBaby, getAllUsers, getBabyMembers, inviteUserToBaby, removeUserFromBaby } = useBaby();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newBabyName, setNewBabyName] = useState('');
  const [newBabyDOB, setNewBabyDOB] = useState('');
  const [newBabyRole, setNewBabyRole] = useState('mom');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  
  // Invite feature states
  const [selectedBabyForInvite, setSelectedBabyForInvite] = useState(null);
  const [allUsers, setAllUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState('');
  const [selectedRole, setSelectedRole] = useState('other');
  const [inviteLoading, setInviteLoading] = useState(false);
  const [members, setMembers] = useState([]);

  // Fetch all users when component mounts
  useEffect(() => {
    fetchAllUsers();
  }, []);

  // Fetch members when a baby is selected for invite
  useEffect(() => {
    if (selectedBabyForInvite) {
      fetchMembers(selectedBabyForInvite);
    }
  }, [selectedBabyForInvite]);

  const fetchAllUsers = async () => {
    const { data } = await getAllUsers();
    if (data) {
      setAllUsers(data);
    }
  };

  const fetchMembers = async (babyId) => {
    const { data } = await getBabyMembers(babyId);
    if (data) {
      setMembers(data);
    }
  };

  const handleCreateBaby = async (e) => {
    e.preventDefault();
    
    if (!newBabyName.trim()) {
      setMessage({ type: 'error', text: t('babyNameRequired') });
      return;
    }

    setLoading(true);
    setMessage({ type: '', text: '' });

    const { error, data } = await createBaby({
      name: newBabyName.trim(),
      date_of_birth: newBabyDOB || null,
    });

    if (error) {
      setMessage({ type: 'error', text: t('errorCreatingBaby') });
    } else {
      // Update the creator's role if not 'mom' (default from trigger)
      if (newBabyRole !== 'mom' && data) {
        const { error: roleError } = await supabase
          .from('baby_users')
          .update({ role: newBabyRole })
          .eq('baby_id', data.id)
          .eq('user_id', user.id);
        
        if (roleError) {
          console.error('Error updating role:', roleError);
        }
      }
      
      setMessage({ type: 'success', text: t('babyCreatedSuccessfully') });
      setNewBabyName('');
      setNewBabyDOB('');
      setNewBabyRole('mom');
      setShowCreateForm(false);
      
      setTimeout(() => {
        setMessage({ type: '', text: '' });
      }, 3000);
    }

    setLoading(false);
  };

  const handleInviteUser = async (e) => {
    e.preventDefault();
    
    if (!selectedUserId) {
      setMessage({ type: 'error', text: t('pleaseSelectUser') });
      return;
    }

    // Check if user already has access
    if (members.some(m => m.user_id === selectedUserId)) {
      setMessage({ type: 'error', text: t('userAlreadyHasAccess') });
      return;
    }

    setInviteLoading(true);
    setMessage({ type: '', text: '' });

    const { error } = await inviteUserToBaby(selectedBabyForInvite, selectedUserId, selectedRole);

    if (error) {
      setMessage({ type: 'error', text: t('errorInvitingUser') });
    } else {
      setMessage({ type: 'success', text: t('userInvitedSuccessfully') });
      setSelectedUserId('');
      setSelectedRole('other');
      fetchMembers(selectedBabyForInvite);
      
      setTimeout(() => {
        setMessage({ type: '', text: '' });
      }, 3000);
    }

    setInviteLoading(false);
  };

  const handleRemoveMember = async (babyUserId, memberEmail) => {
    if (!confirm(t('confirmRemoveMember') + ' ' + memberEmail + '?')) {
      return;
    }

    const { error } = await removeUserFromBaby(babyUserId);

    if (error) {
      setMessage({ type: 'error', text: t('errorRemovingUser') });
    } else {
      setMessage({ type: 'success', text: t('userRemovedSuccessfully') });
      fetchMembers(selectedBabyForInvite);
      
      setTimeout(() => {
        setMessage({ type: '', text: '' });
      }, 3000);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-800">
            {t('manageBabies')}
          </h2>
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition-colors"
          >
            {showCreateForm ? t('cancel') : t('addBaby')}
          </button>
        </div>

        {/* Create Baby Form */}
        {showCreateForm && (
          <form onSubmit={handleCreateBaby} className="space-y-4 border-t pt-4">
            <div>
              <label htmlFor="babyName" className="block text-sm font-medium text-gray-700 mb-2">
                {t('babyName')} *
              </label>
              <input
                type="text"
                id="babyName"
                value={newBabyName}
                onChange={(e) => setNewBabyName(e.target.value)}
                placeholder={t('enterBabyName')}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label htmlFor="babyDOB" className="block text-sm font-medium text-gray-700 mb-2">
                {t('dateOfBirth')} <span className="text-gray-500 text-xs">({t('optional')})</span>
              </label>
              <input
                type="date"
                id="babyDOB"
                value={newBabyDOB}
                onChange={(e) => setNewBabyDOB(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label htmlFor="yourRole" className="block text-sm font-medium text-gray-700 mb-2">
                {t('yourRole')} *
              </label>
              <select
                id="yourRole"
                value={newBabyRole}
                onChange={(e) => setNewBabyRole(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="mom">{t('mom')}</option>
                <option value="dad">{t('dad')}</option>
                <option value="other">{t('other')}</option>
              </select>
              <p className="text-xs text-gray-500 mt-1">{t('selectYourRole')}</p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors disabled:bg-gray-400"
            >
              {loading ? t('creating') : t('createBaby')}
            </button>

            {message.text && (
              <div
                className={`p-4 rounded-lg ${
                  message.type === 'success'
                    ? 'bg-green-100 text-green-700 border border-green-200'
                    : 'bg-red-100 text-red-700 border border-red-200'
                }`}
              >
                {message.text}
              </div>
            )}
          </form>
        )}
      </div>

      {/* Baby List with Invite */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          {t('yourBabies')} ({babies.length})
        </h3>

        {babies.length === 0 ? (
          <p className="text-gray-500 text-center py-8">
            {t('noBabiesYet')}
          </p>
        ) : (
          <div className="space-y-3">
            {babies.map((baby) => (
              <div
                key={baby.id}
                className={`p-4 border-2 rounded-lg ${
                  currentBaby?.id === baby.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h4 className="font-semibold text-gray-800">
                      {baby.name}
                      {currentBaby?.id === baby.id && (
                        <span className="ml-2 text-xs bg-blue-500 text-white px-2 py-0.5 rounded">
                          {t('current')}
                        </span>
                      )}
                    </h4>
                    {baby.date_of_birth && (
                      <p className="text-sm text-gray-600">
                        {t('born')}: {new Date(baby.date_of_birth).toLocaleDateString()}
                      </p>
                    )}
                    <p className="text-xs text-gray-500 mt-1">
                      {t('yourRole')}: <span className="font-medium">{t(baby.role)}</span>
                    </p>
                  </div>
                  <button
                    onClick={() => setSelectedBabyForInvite(selectedBabyForInvite === baby.id ? null : baby.id)}
                    className="px-3 py-1 text-sm bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors"
                  >
                    {selectedBabyForInvite === baby.id ? t('hideInvite') : t('inviteUsers')}
                  </button>
                </div>

                {/* Invite Section */}
                {selectedBabyForInvite === baby.id && (
                  <div className="border-t pt-3 mt-3 space-y-4">
                    {/* Invite Form */}
                    <form onSubmit={handleInviteUser} className="space-y-3">
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">
                            {t('selectUser')}
                          </label>
                          <select
                            value={selectedUserId}
                            onChange={(e) => setSelectedUserId(e.target.value)}
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            required
                          >
                            <option value="">{t('chooseUser')}</option>
                            {allUsers
                              .filter(u => u.id !== user.id)
                              .map((u) => (
                                <option key={u.id} value={u.id}>
                                  {u.full_name || u.email}
                                </option>
                              ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">
                            {t('role')}
                          </label>
                          <select
                            value={selectedRole}
                            onChange={(e) => setSelectedRole(e.target.value)}
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="mom">{t('mom')}</option>
                            <option value="dad">{t('dad')}</option>
                            <option value="other">{t('other')}</option>
                          </select>
                        </div>
                      </div>
                      <button
                        type="submit"
                        disabled={inviteLoading}
                        className="w-full bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-lg transition-colors disabled:bg-gray-400 text-sm"
                      >
                        {inviteLoading ? t('inviting') : t('inviteUser')}
                      </button>
                    </form>

                    {/* Current Members List */}
                    <div className="border-t pt-3">
                      <h5 className="text-sm font-semibold text-gray-700 mb-2">
                        {t('currentMembers')} ({members.length})
                      </h5>
                      {members.length === 0 ? (
                        <p className="text-xs text-gray-500">{t('loadingMembers')}</p>
                      ) : (
                        <div className="space-y-2">
                          {members.map((member) => (
                            <div
                              key={member.id}
                              className="flex items-center justify-between p-2 bg-gray-50 rounded-lg"
                            >
                              <div className="flex-1">
                                <p className="text-sm font-medium text-gray-800">
                                  {member.full_name || member.email}
                                  {member.user_id === user.id && (
                                    <span className="ml-2 text-xs text-blue-600">({t('you')})</span>
                                  )}
                                </p>
                                <p className="text-xs text-gray-500">{member.email}</p>
                                <p className="text-xs text-gray-600 mt-0.5">
                                  {t('role')}: <span className="font-medium">{t(member.role)}</span>
                                </p>
                              </div>
                              {member.user_id !== user.id && (
                                <button
                                  onClick={() => handleRemoveMember(member.id, member.email)}
                                  className="text-red-500 hover:text-red-700 text-xs font-medium transition-colors"
                                >
                                  {t('remove')}
                                </button>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

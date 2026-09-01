import { useState } from 'react';
import { useParams } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import ProfileHeader from '../components/profile/ProfileHeader';
import UserPosts from '../components/profile/UserPosts';
import EditProfile from '../components/profile/EditProfile';
import Modal from '../components/common/Modal';
import useFetch from '../hooks/useFetch';
import { getUserApi } from '../services/userApi';

const Profile = () => {
  const { id } = useParams();
  const { data, loading, refetch } = useFetch(() => getUserApi(id), [id]);
  const [editOpen, setEditOpen] = useState(false);

  return (
    <MainLayout>
      <div className="space-y-5">
        <ProfileHeader
          user={data?.user}
          onEdit={() => setEditOpen(true)}
          onFollowChange={refetch}
        />
        <h2 className="text-sm font-medium text-brand-600 px-1">Posts</h2>
        <UserPosts posts={data?.posts} loading={loading} />
      </div>

      <Modal isOpen={editOpen} onClose={() => setEditOpen(false)} title="Edit Profile">
        <EditProfile onClose={() => { setEditOpen(false); refetch(); }} />
      </Modal>
    </MainLayout>
  );
};

export default Profile;
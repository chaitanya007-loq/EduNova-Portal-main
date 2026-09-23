import React, { useState } from 'react';
import { sampleCommunityPosts } from '../../data/community';
import { CommunityHero } from '../../components/community/CommunityHero';
import { CommunityNavigationTabs } from '../../components/community/CommunityNavigationTabs';
import { PostCardEnhanced } from '../../components/community/PostCardEnhanced';
import { SageSummaryBox } from '../../components/community/SageSummaryBox';
import { StudyGroupsTab } from '../../components/community/StudyGroupsTab';
import { MentorsTab } from '../../components/community/MentorsTab';
import { ProjectsTab, ResourcesTab } from '../../components/community/ProjectsTab';
import { CommunitySidebar } from '../../components/community/CommunitySidebar';
import { CreatePostModalEnhanced } from '../../components/community/CreatePostModalEnhanced';
import { useLearning } from '../../context/LearningContext';

export const CommunityPage = () => {
  const { earnXp } = useLearning();

  const [posts, setPosts] = useState(sampleCommunityPosts);
  const [activeTab, setActiveTab] = useState('for-you');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  const handleAddPost = (newPost) => {
    setPosts([newPost, ...posts]);
  };

  const handleTurnIntoQuiz = (post) => {
    earnXp(50, `Converted Discussion (${post.title.slice(0, 20)}...) to Quiz`, 'Learning');
    setToastMessage(`✨ Sage generated a 5-question Quiz from "${post.title.slice(0, 30)}..."! (+50 XP)`);
    setTimeout(() => setToastMessage(null), 4500);
  };

  const handleTurnIntoNotes = (post) => {
    setToastMessage(`📚 Sage compiled revision notes from "${post.title.slice(0, 30)}..." into your Study Planner!`);
    setTimeout(() => setToastMessage(null), 4500);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {toastMessage && (
        <div
          style={{
            position: 'fixed',
            top: '88px',
            right: '24px',
            background: 'linear-gradient(135deg, #06b6d4, #6366f1)',
            color: '#fff',
            padding: '12px 20px',
            borderRadius: 'var(--radius-lg)',
            boxShadow: '0 10px 30px rgba(6, 182, 212, 0.4)',
            zIndex: 9999,
            fontWeight: 800,
            fontSize: '0.88rem'
          }}
        >
          {toastMessage}
        </div>
      )}

      <CommunityHero
        onOpenAskModal={() => setIsCreateModalOpen(true)}
        onOpenGroupModal={() => setActiveTab('groups')}
        onOpenMentorTab={() => setActiveTab('mentors')}
      />

      <CommunityNavigationTabs
        activeTab={activeTab}
        onChangeTab={(t) => setActiveTab(t)}
      />

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 320px', gap: '28px' }}>
        <div>
          {['for-you', 'trending', 'latest', 'unanswered'].includes(activeTab) && (
            <>
              <SageSummaryBox
                onTurnQuiz={() => handleTurnIntoQuiz(posts[0])}
                onTurnNotes={() => handleTurnIntoNotes(posts[0])}
              />

              {posts.map((p) => (
                <PostCardEnhanced
                  key={p.id}
                  post={p}
                  onTurnIntoQuiz={handleTurnIntoQuiz}
                  onTurnIntoNotes={handleTurnIntoNotes}
                />
              ))}
            </>
          )}

          {activeTab === 'groups' && <StudyGroupsTab />}
          {activeTab === 'mentors' && <MentorsTab />}
          {activeTab === 'resources' && <ResourcesTab />}
          {activeTab === 'projects' && <ProjectsTab />}
        </div>

        <CommunitySidebar />
      </div>

      <CreatePostModalEnhanced
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onAddPost={handleAddPost}
      />
    </div>
  );
};

export default CommunityPage;

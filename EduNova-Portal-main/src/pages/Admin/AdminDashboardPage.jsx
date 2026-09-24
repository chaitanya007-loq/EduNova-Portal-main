import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import {
  AlertTriangle,
  BookOpen,
  CheckCircle2,
  ChevronRight,
  LayoutDashboard,
  Library,
  Loader2,
  Plus,
  RefreshCw,
  Search,
  ShieldCheck,
  Trash2,
  Users,
  X,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { adminApi } from '../../lib/apiClient';

const emptyCourse = { title: '', description: '', category: '', difficulty: 'BEGINNER', thumbnail: '', instructorId: '', modules: [] };
const emptySubject = { name: '', category: '', educationType: 'SCHOOL', class: '', board: '', degree: '', branch: '', semester: '', exam: '', topics: [] };
const roles = ['ADMIN', 'INSTRUCTOR', 'STUDENT', 'PARENT'];

const panelStyle = { background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '14px', padding: '20px' };
const inputStyle = { width: '100%', marginTop: '6px' };

function Field({ label, children }) {
  return <label style={{ display: 'block', color: 'var(--text-muted)', fontSize: '0.78rem', fontWeight: 700 }}>{label}{children}</label>;
}

function AdminOnly({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div style={{ padding: 40 }}>Loading admin access...</div>;
  if (user?.role !== 'ADMIN') return <Navigate to="/dashboard" replace />;
  return children;
}

export function AdminDashboardPage() {
  return <AdminOnly><AdminWorkspace /></AdminOnly>;
}

function AdminWorkspace() {
  const [tab, setTab] = useState('overview');
  const [metrics, setMetrics] = useState(null);
  const [users, setUsers] = useState({ users: [], total: 0 });
  const [courses, setCourses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [course, setCourse] = useState(emptyCourse);
  const [subject, setSubject] = useState(emptySubject);
  const [editingCourse, setEditingCourse] = useState(null);
  const [editingSubject, setEditingSubject] = useState(null);
  const [search, setSearch] = useState('');
  const [notice, setNotice] = useState(null);
  const [busy, setBusy] = useState(false);

  const notify = (message, type = 'success') => {
    setNotice({ message, type });
    window.setTimeout(() => setNotice(null), 3500);
  };

  const loadData = async () => {
    setBusy(true);
    try {
      const [metricsResponse, usersResponse, coursesResponse, subjectsResponse] = await Promise.all([
        adminApi.getMetrics(),
        adminApi.getUsers({ limit: 50, search: search || undefined }),
        adminApi.getCourses({ search: search || undefined }),
        adminApi.getSubjects({ search: search || undefined }),
      ]);
      setMetrics(metricsResponse.data);
      setUsers(usersResponse.data || { users: [], total: 0 });
      setCourses(coursesResponse.data || []);
      setSubjects(subjectsResponse.data || []);
    } catch (error) {
      notify(error.message || 'Could not load admin data', 'error');
    } finally {
      setBusy(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  const submitCourse = async (event) => {
    event.preventDefault();
    setBusy(true);
    try {
      const response = editingCourse
        ? await adminApi.updateCourse(editingCourse.id, course)
        : await adminApi.createCourse(course);
      notify(response.message || 'Course saved');
      setCourse(emptyCourse);
      setEditingCourse(null);
      await loadData();
    } catch (error) {
      notify(error.message || 'Could not save course', 'error');
      setBusy(false);
    }
  };

  const submitSubject = async (event) => {
    event.preventDefault();
    setBusy(true);
    try {
      const response = editingSubject
        ? await adminApi.updateSubject(editingSubject.id, subject)
        : await adminApi.createSubject(subject);
      notify(response.message || 'Subject saved');
      setSubject(emptySubject);
      setEditingSubject(null);
      await loadData();
    } catch (error) {
      notify(error.message || 'Could not save subject', 'error');
      setBusy(false);
    }
  };

  const deleteContent = async (type, id) => {
    if (!window.confirm(`Delete this ${type}? This cannot be undone.`)) return;
    setBusy(true);
    try {
      await adminApi.deleteContent(type, id);
      notify(`${type} deleted`);
      await loadData();
    } catch (error) {
      notify(error.message || `Could not delete ${type}`, 'error');
      setBusy(false);
    }
  };

  const updateRole = async (id, role) => {
    try {
      await adminApi.updateUserRole(id, role);
      notify('User role updated');
      await loadData();
    } catch (error) {
      notify(error.message || 'Could not update role', 'error');
    }
  };

  const addModule = () => setCourse((current) => ({ ...current, modules: [...current.modules, { title: '', duration: 30 }] }));
  const addTopic = () => setSubject((current) => ({ ...current, topics: [...current.topics, ''] }));
  const navItems = [
    ['overview', 'Overview', LayoutDashboard],
    ['users', 'Users', Users],
    ['courses', 'Courses', BookOpen],
    ['subjects', 'Subjects', Library],
  ];
  const NoticeIcon = notice?.type === 'error' ? AlertTriangle : CheckCircle2;

  return (
    <div style={{ maxWidth: 1440, margin: '0 auto', padding: '24px 8px 80px' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', gap: 20, alignItems: 'flex-start', marginBottom: 26 }}>
        <div>
          <div style={{ color: 'var(--accent-primary)', fontSize: '0.75rem', fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase' }}>Control center</div>
          <h1 style={{ marginTop: 6 }}>Admin workspace</h1>
          <p style={{ color: 'var(--text-muted)', marginTop: 6 }}>Manage EduNova content, access, and learning operations from one place.</p>
        </div>
        <button type="button" onClick={loadData} title="Refresh admin data" style={{ display: 'inline-flex', gap: 8, alignItems: 'center', padding: '10px 14px', borderRadius: 9, color: 'var(--text-primary)', border: '1px solid var(--border-color)' }}>
          <RefreshCw size={16} className={busy ? 'spin' : ''} /> Refresh
        </button>
      </header>

      {notice && <div style={{ ...panelStyle, marginBottom: 18, borderColor: notice.type === 'error' ? '#ef4444' : '#22c55e', display: 'flex', gap: 10, alignItems: 'center' }}><NoticeIcon size={18} />{notice.message}</div>}

      <nav style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 20 }}>
        {navItems.map(([key, label, Icon]) => <button type="button" key={key} onClick={() => setTab(key)} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '10px 14px', borderRadius: 9, background: tab === key ? 'var(--accent-primary)' : 'var(--bg-secondary)', color: tab === key ? '#fff' : 'var(--text-muted)', border: '1px solid var(--border-color)', fontWeight: 700 }}><Icon size={16} />{label}</button>)}
      </nav>

      {tab === 'overview' && <Overview metrics={metrics} />}
      {tab === 'users' && <UsersPanel users={users} search={search} setSearch={setSearch} onSearch={loadData} onRoleChange={updateRole} />}
      {tab === 'courses' && <ContentPanel title="Course catalog" items={courses} type="course" onEdit={(item) => { setEditingCourse(item); setCourse({ ...item, modules: item.modules || [] }); }} onDelete={deleteContent} form={<CourseForm course={course} setCourse={setCourse} editing={editingCourse} onSubmit={submitCourse} onCancel={() => { setEditingCourse(null); setCourse(emptyCourse); }} onAddModule={addModule} />} />}
      {tab === 'subjects' && <ContentPanel title="Curriculum subjects" items={subjects} type="subject" onEdit={(item) => { setEditingSubject(item); setSubject({ ...item, class: item.class || '', topics: (item.topics || []).map((topic) => topic.title) }); }} onDelete={deleteContent} form={<SubjectForm subject={subject} setSubject={setSubject} editing={editingSubject} onSubmit={submitSubject} onCancel={() => { setEditingSubject(null); setSubject(emptySubject); }} onAddTopic={addTopic} />} />}
    </div>
  );
}

function Overview({ metrics }) {
  const cards = [
    ['Users', metrics?.users?.total ?? 0, Users],
    ['Published courses', metrics?.content?.publishedCourses ?? 0, BookOpen],
    ['Subjects', metrics?.content?.totalSubjects ?? 0, Library],
    ['Enrollments', metrics?.content?.totalEnrollments ?? 0, ShieldCheck],
  ];
  return <>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 14, marginBottom: 20 }}>{cards.map(([label, value, Icon]) => <div key={label} style={panelStyle}><Icon size={18} color="var(--accent-primary)" /><div style={{ fontSize: '2rem', fontWeight: 800, marginTop: 10 }}>{value}</div><div style={{ color: 'var(--text-muted)' }}>{label}</div></div>)}</div>
    <div style={{ ...panelStyle, display: 'grid', gap: 12 }}><h2>Recent admin activity</h2>{metrics?.recentAuditLogs?.length ? metrics.recentAuditLogs.map((log) => <div key={log.id} style={{ display: 'flex', justifyContent: 'space-between', gap: 12, borderTop: '1px solid var(--border-color)', paddingTop: 12 }}><span><strong>{log.action}</strong> on {log.targetType}</span><span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{log.admin?.name || 'Admin'}</span></div>) : <p style={{ color: 'var(--text-muted)' }}>No admin actions recorded yet.</p>}</div>
  </>;
}

function UsersPanel({ users, search, setSearch, onSearch, onRoleChange }) {
  return <section style={panelStyle}><div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap', marginBottom: 18 }}><div><h2>User access</h2><p style={{ color: 'var(--text-muted)' }}>{users.total || 0} accounts</p></div><div style={{ display: 'flex', gap: 8 }}><div style={{ position: 'relative' }}><Search size={16} style={{ position: 'absolute', left: 10, top: 13, color: 'var(--text-muted)' }} /><input value={search} onChange={(event) => setSearch(event.target.value)} onKeyDown={(event) => event.key === 'Enter' && onSearch()} placeholder="Search users" style={{ paddingLeft: 34 }} /></div><button type="button" onClick={onSearch} style={{ padding: '8px 12px', borderRadius: 8, background: 'var(--accent-primary)', color: '#fff' }}>Search</button></div></div><div style={{ overflowX: 'auto' }}><table style={{ width: '100%', borderCollapse: 'collapse' }}><thead><tr>{['Name', 'Email', 'Learner type', 'Role', 'Joined'].map((heading) => <th key={heading} style={{ textAlign: 'left', color: 'var(--text-muted)', fontSize: '0.75rem', padding: '10px 8px', borderBottom: '1px solid var(--border-color)' }}>{heading}</th>)}</tr></thead><tbody>{users.users.map((item) => <tr key={item.id}>{[item.name, item.email || item.phone || 'No contact', item.learnerType].map((value) => <td key={value} style={{ padding: '13px 8px', borderBottom: '1px solid var(--border-color)' }}>{value}</td>)}<td style={{ padding: '13px 8px', borderBottom: '1px solid var(--border-color)' }}><select value={item.role} onChange={(event) => onRoleChange(item.id, event.target.value)}>{roles.map((role) => <option key={role}>{role}</option>)}</select></td><td style={{ padding: '13px 8px', borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)' }}>{new Date(item.createdAt).toLocaleDateString()}</td></tr>)}</tbody></table></div></section>;
}

function ContentPanel({ title, items, type, form, onEdit, onDelete }) {
  return <div style={{ display: 'grid', gridTemplateColumns: 'minmax(280px, 0.8fr) minmax(360px, 1.2fr)', gap: 18, alignItems: 'start' }}><section style={panelStyle}>{form}</section><section style={panelStyle}><h2>{title}</h2><div style={{ display: 'grid', gap: 10, marginTop: 16 }}>{items.map((item) => <article key={item.id} style={{ border: '1px solid var(--border-color)', borderRadius: 10, padding: 14 }}><div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}><div><strong>{item.title || item.name}</strong><div style={{ color: 'var(--text-muted)', fontSize: '0.82rem', marginTop: 3 }}>{item.category} · {type === 'course' ? `${item.modules?.length || 0} modules` : `${item.topics?.length || 0} topics`}</div></div><div style={{ display: 'flex', gap: 4 }}><button type="button" onClick={() => onEdit(item)} title={`Edit ${type}`} style={{ padding: 6, color: 'var(--accent-primary)' }}><ChevronRight size={18} /></button><button type="button" onClick={() => onDelete(type, item.id)} title={`Delete ${type}`} style={{ padding: 6, color: '#ef4444' }}><Trash2 size={17} /></button></div></div></article>)}</div></section></div>;
}

function CourseForm({ course, setCourse, editing, onSubmit, onCancel, onAddModule }) {
  return <form onSubmit={onSubmit}><div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}><h2>{editing ? 'Edit course' : 'New course'}</h2>{editing && <button type="button" onClick={onCancel} title="Cancel editing"><X size={18} /></button>}</div><div style={{ display: 'grid', gap: 12, marginTop: 16 }}><Field label="Title"><input required value={course.title} onChange={(e) => setCourse({ ...course, title: e.target.value })} style={inputStyle} /></Field><Field label="Category"><input required value={course.category} onChange={(e) => setCourse({ ...course, category: e.target.value })} style={inputStyle} /></Field><Field label="Difficulty"><select value={course.difficulty} onChange={(e) => setCourse({ ...course, difficulty: e.target.value })} style={inputStyle}>{['BEGINNER', 'INTERMEDIATE', 'ADVANCED'].map((value) => <option key={value}>{value}</option>)}</select></Field><Field label="Description"><textarea rows={3} value={course.description || ''} onChange={(e) => setCourse({ ...course, description: e.target.value })} style={inputStyle} /></Field><Field label="Thumbnail URL"><input type="url" value={course.thumbnail || ''} onChange={(e) => setCourse({ ...course, thumbnail: e.target.value })} style={inputStyle} /></Field><div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}><strong>Modules</strong><button type="button" onClick={onAddModule} title="Add module" style={{ color: 'var(--accent-primary)' }}><Plus size={18} /></button></div>{course.modules.map((module, index) => <div key={`${module.id || 'new'}-${index}`} style={{ display: 'grid', gridTemplateColumns: '1fr 90px', gap: 8 }}><input required placeholder={`Module ${index + 1}`} value={module.title} onChange={(e) => { const modules = [...course.modules]; modules[index] = { ...modules[index], title: e.target.value }; setCourse({ ...course, modules }); }} /><input type="number" min="0" value={module.duration || 0} onChange={(e) => { const modules = [...course.modules]; modules[index] = { ...modules[index], duration: Number(e.target.value) }; setCourse({ ...course, modules }); }} /></div>)}<button type="submit" style={{ padding: '11px 14px', borderRadius: 8, background: 'var(--accent-primary)', color: '#fff', fontWeight: 800 }}>{editing ? 'Save course' : 'Publish course'}</button></div></form>;
}

function SubjectForm({ subject, setSubject, editing, onSubmit, onCancel, onAddTopic }) {
  return <form onSubmit={onSubmit}><div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}><h2>{editing ? 'Edit subject' : 'New subject'}</h2>{editing && <button type="button" onClick={onCancel} title="Cancel editing"><X size={18} /></button>}</div><div style={{ display: 'grid', gap: 12, marginTop: 16 }}><Field label="Name"><input required value={subject.name} onChange={(e) => setSubject({ ...subject, name: e.target.value })} style={inputStyle} /></Field><Field label="Category"><input required value={subject.category} onChange={(e) => setSubject({ ...subject, category: e.target.value })} style={inputStyle} /></Field><Field label="Education type"><select value={subject.educationType} onChange={(e) => setSubject({ ...subject, educationType: e.target.value })} style={inputStyle}>{['SCHOOL', 'COLLEGE', 'SKILLS', 'EXAM'].map((value) => <option key={value}>{value}</option>)}</select></Field><div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}><input placeholder="Class" value={subject.class || ''} onChange={(e) => setSubject({ ...subject, class: e.target.value })} /><input placeholder="Board" value={subject.board || ''} onChange={(e) => setSubject({ ...subject, board: e.target.value })} /></div><div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}><strong>Topics</strong><button type="button" onClick={onAddTopic} title="Add topic" style={{ color: 'var(--accent-primary)' }}><Plus size={18} /></button></div>{subject.topics.map((topic, index) => <input key={`${topic}-${index}`} required placeholder={`Topic ${index + 1}`} value={topic} onChange={(e) => { const topics = [...subject.topics]; topics[index] = e.target.value; setSubject({ ...subject, topics }); }} />)}<button type="submit" style={{ padding: '11px 14px', borderRadius: 8, background: 'var(--accent-primary)', color: '#fff', fontWeight: 800 }}>{editing ? 'Save subject' : 'Create subject'}</button></div></form>;
}

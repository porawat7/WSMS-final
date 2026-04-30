// 🔥 เปลี่ยน user state
const [user, setUser] = useState(
  JSON.parse(localStorage.getItem('user')) || {
    email: '-',
    status: 'basic',
    name: 'User'
  }
);

// 🔥 listen update
useEffect(() => {
  const updateUser = () => {
    const u = JSON.parse(localStorage.getItem('user'));
    if (u) setUser(u);
  };

  window.addEventListener('userChanged', updateUser);
  return () => window.removeEventListener('userChanged', updateUser);
}, []);

// 🔥 fetch usage ใหม่
useEffect(() => {
  const fetchUsage = async () => {
    try {
      if (!user?.api_key) return;

      const res = await fetch('http://localhost:8081/api/v1/usage', {
        headers: {
          'x-api-key': user.api_key
        }
      });

      const data = await res.json();

      setUsage(data.used || 0);
      setLimit(data.limit || 1000);

    } catch (err) {
      console.error(err);
    }
  };

  fetchUsage();
}, [user]);

// 🔥 เอา unlimited ออก
const remaining = limit - usage;
const percent = Math.min((usage / limit) * 100, 100);
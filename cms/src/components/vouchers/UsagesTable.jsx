import React from 'react';
import { Calendar, User } from 'lucide-react';

const UsagesTable = ({ isLoading, filteredUsages, users, searchTerm }) => {
  return (
    <>
      {isLoading ? (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '48px 0' }}>
          <div className="spinner" style={spinnerStyle}></div>
          <p style={{ color: 'var(--text-secondary)', marginTop: '12px', fontSize: '14px' }}>Memuat daftar pengguna...</p>
        </div>
      ) : filteredUsages.length > 0 ? (
        <div className="table-responsive" style={{ borderRadius: '12px', border: '1px solid var(--border-color)', overflow: 'hidden' }}>
          <table style={{ borderCollapse: 'collapse', width: '100%' }}>
            <thead>
              <tr style={{ backgroundColor: 'var(--bg-home)' }}>
                <th style={thStyle}>No</th>
                <th style={{ ...thStyle, textAlign: 'left' }}>Nama Pengguna</th>
                <th style={{ ...thStyle, textAlign: 'left' }}>Email Customer</th>
                <th style={{ ...thStyle, textAlign: 'center' }}>Tanggal Penggunaan</th>
              </tr>
            </thead>
            <tbody>
               {filteredUsages.map((u, index) => {
                let userName = 'Customer Tidak Ditemukan';
                let userEmail = `ID: ${u.userId}`;
                
                if (u.userId === 'usr-demo-1') {
                  userName = 'Ahmad Fauzi';
                  userEmail = 'ahmad.fauzi@gmail.com';
                } else if (u.userId === 'usr-demo-2') {
                  userName = 'Sarah Wijaya';
                  userEmail = 'sarah.wijaya@yahoo.com';
                } else if (u.userId === 'usr-demo-3') {
                  userName = 'Budi Santoso';
                  userEmail = 'budi.santoso@outlook.com';
                } else {
                  const foundUser = users.find(usr => (usr.id || usr._id) === u.userId);
                  if (foundUser) {
                    userName = foundUser.name;
                    userEmail = foundUser.email;
                  }
                }

                return (
                  <tr key={u.id || u._id} className="table-row-hover" style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ ...tdStyle, textAlign: 'center', fontWeight: 600, color: 'var(--text-secondary)', width: '60px' }}>
                      {index + 1}
                    </td>
                    <td style={{ ...tdStyle, textAlign: 'left' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <img 
                          src={`https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&background=6366f1&color=fff&bold=true`} 
                          alt={userName} 
                          style={{ width: '32px', height: '32px', borderRadius: '10px' }} 
                        />
                        <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>
                          {userName}
                        </span>
                      </div>
                    </td>
                    <td style={{ ...tdStyle, textAlign: 'left', color: 'var(--text-secondary)' }}>
                      {userEmail}
                    </td>
                    <td style={{ ...tdStyle, textAlign: 'center', color: 'var(--text-secondary)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                        <Calendar size={14} />
                        <span>
                          {new Date(u.createdAt).toLocaleString('id-ID', {
                            day: '2-digit',
                            month: 'long',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '48px 24px', color: 'var(--text-secondary)' }}>
          <User size={48} style={{ opacity: 0.4, marginBottom: '16px' }} />
          <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '8px' }}>
            Tidak Ada Pengguna
          </h3>
          <p style={{ fontSize: '14px', maxWidth: '380px', margin: '0 auto' }}>
            {searchTerm ? 'Pencarian tidak menemukan customer yang cocok.' : 'Belum ada customer yang menggunakan voucher ini.'}
          </p>
        </div>
      )}
    </>
  );
};

const thStyle = {
  padding: '14px 16px',
  fontSize: '11px',
  fontWeight: 700,
  color: 'var(--text-secondary)',
  textTransform: 'uppercase',
  borderBottom: '1.5px solid var(--border-color)',
  boxSizing: 'border-box'
};

const tdStyle = {
  padding: '14px 16px',
  fontSize: '13.5px',
  color: 'var(--text-primary)',
  borderBottom: '1px solid var(--border-color)',
  boxSizing: 'border-box'
};

const spinnerStyle = {
  width: '32px',
  height: '32px',
  border: '3px solid rgba(99, 102, 241, 0.1)',
  borderTopColor: 'var(--primary)',
  borderRadius: '50%',
  animation: 'spinnerUsagesRotate 0.8s linear infinite'
};

export default UsagesTable;

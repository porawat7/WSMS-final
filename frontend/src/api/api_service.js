// src/api/api_service.js

const API_BASE_URL = 'http://localhost:5000/api'; // URL ของ Backend เพื่อน (porawat7)

/**
 * ดึงรายการ API ทั้งหมดจากระบบ
 */
export const getAllAPIs = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/products`);
        if (!response.ok) throw new Error('Network response was not ok');
        return await response.json();
    } catch (error) {
        console.error('Error fetching APIs:', error);
        return [];
    }
};

/**
 * ดึงรายละเอียดของ API รายตัว (Docs & JSON Example)
 */
export const getAPIDetail = async (id) => {
    try {
        const response = await fetch(`${API_BASE_URL}/products/${id}`);
        if (!response.ok) throw new Error('API not found');
        return await response.json();
    } catch (error) {
        console.error('Error fetching API detail:', error);
        return null;
    }
};

/**
 * ดึงข้อมูลการใช้งาน (Usage Quota) ของ User
 */
export const getUserUsage = async (userId) => {
    try {
        const response = await fetch(`${API_BASE_URL}/users/${userId}/usage`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}` // ส่ง Token เพื่อเช็กสิทธิ์
            }
        });
        return await response.json();
    } catch (error) {
        console.error('Error fetching usage stats:', error);
        return { used: 0, limit: 100 };
    }
};

/**
 * ฟังก์ชันสำหรับการแจ้งโอนเงิน (Payment)
 */
export const submitPayment = async (paymentData) => {
    try {
        const response = await fetch(`${API_BASE_URL}/payments`, {
            method: 'POST',
            body: paymentData, // ส่งแบบ FormData เพราะมีไฟล์สลิป
        });
        return await response.json();
    } catch (error) {
        console.error('Payment submission failed:', error);
        throw error;
    }
};
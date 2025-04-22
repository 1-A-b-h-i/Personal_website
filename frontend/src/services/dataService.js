import { db } from '../firebase';
import { collection, doc, getDoc, getDocs, query, where, orderBy, limit, addDoc } from 'firebase/firestore';

// Experience data
export const getExperience = async () => {
  try {
    const docRef = doc(db, 'website_data', 'main_data');
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      // Use experience_details from knowledge.json if available, fall back to experience
      const data = docSnap.data();
      return data.experience_details || data.experience || [];
    } else {
      console.log('No experience data found');
      return [];
    }
  } catch (error) {
    console.error('Error fetching experience:', error);
    return [];
  }
};

// Achievements data
export const getAchievements = async () => {
  try {
    const docRef = doc(db, 'website_data', 'main_data');
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      // Use achievements_details from knowledge.json if available, fall back to achievements
      const data = docSnap.data();
      return data.achievements_details || data.achievements || [];
    } else {
      console.log('No achievements data found');
      return [];
    }
  } catch (error) {
    console.error('Error fetching achievements:', error);
    return [];
  }
};

// Blog posts - now fetches from blog_posts collection
export const getBlogPosts = async () => {
  try {
    const blogQuery = query(
      collection(db, 'blog_posts'),
      orderBy('createdAt', 'desc')
    );
    
    const snapshot = await getDocs(blogQuery);
    if (snapshot.empty) {
      // Fall back to the main_data if no posts in the collection
      const docRef = doc(db, 'website_data', 'main_data');
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return docSnap.data().blog_posts || [];
      } else {
        return [];
      }
    }
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return [];
  }
};

// Single blog post by ID
export const getBlogPost = async (postId) => {
  try {
    // First try to get from blog_posts collection
    const docRef = doc(db, 'blog_posts', postId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data()
      };
    } else {
      // Fall back to main_data
      const mainDocRef = doc(db, 'website_data', 'main_data');
      const mainDocSnap = await getDoc(mainDocRef);
      
      if (mainDocSnap.exists()) {
        const posts = mainDocSnap.data().blog_posts || [];
        return posts.find(post => post.id === parseInt(postId)) || null;
      } else {
        return null;
      }
    }
  } catch (error) {
    console.error('Error fetching blog post:', error);
    return null;
  }
};

// Get blog post by slug
export const getBlogPostBySlug = async (slug) => {
  try {
    const blogQuery = query(
      collection(db, 'blog_posts'),
      where('slug', '==', slug)
    );
    
    const snapshot = await getDocs(blogQuery);
    
    if (!snapshot.empty) {
      return {
        id: snapshot.docs[0].id,
        ...snapshot.docs[0].data()
      };
    } else {
      // Fall back to main_data
      const mainDocRef = doc(db, 'website_data', 'main_data');
      const mainDocSnap = await getDoc(mainDocRef);
      
      if (mainDocSnap.exists()) {
        const posts = mainDocSnap.data().blog_posts || [];
        return posts.find(post => post.slug === slug) || null;
      } else {
        return null;
      }
    }
  } catch (error) {
    console.error('Error fetching blog post by slug:', error);
    return null;
  }
};

// Store contact form submission
export const submitContactForm = async (contactData) => {
  try {
    const contactsRef = collection(db, 'contacts');
    await addDoc(contactsRef, {
      ...contactData,
      timestamp: new Date()
    });
    return { success: true };
  } catch (error) {
    console.error('Error submitting contact form:', error);
    return { success: false, error: error.message };
  }
};

// Get basic info
export const getBasicInfo = async () => {
  try {
    const docRef = doc(db, 'website_data', 'main_data');
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return docSnap.data().basic_info || {};
    } else {
      console.log('No basic info found');
      return {};
    }
  } catch (error) {
    console.error('Error fetching basic info:', error);
    return {};
  }
};

// Get skills
export const getSkills = async () => {
  try {
    const docRef = doc(db, 'website_data', 'main_data');
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return docSnap.data().skills || {};
    } else {
      console.log('No skills data found');
      return {};
    }
  } catch (error) {
    console.error('Error fetching skills:', error);
    return {};
  }
};

// Get projects
export const getProjects = async () => {
  try {
    const docRef = doc(db, 'website_data', 'main_data');
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return docSnap.data().projects || [];
    } else {
      console.log('No projects data found');
      return [];
    }
  } catch (error) {
    console.error('Error fetching projects:', error);
    return [];
  }
}; 
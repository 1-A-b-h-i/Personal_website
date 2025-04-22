import { db } from '../firebase';
import { getCurrentUser } from './authService';
import { 
  collection, 
  doc, 
  addDoc, 
  getDoc, 
  getDocs, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  serverTimestamp
} from 'firebase/firestore';

// Get all blog posts from the dedicated blog_posts collection
export const getAllBlogPosts = async () => {
  try {
    const blogQuery = query(
      collection(db, 'blog_posts'),
      orderBy('createdAt', 'desc')
    );
    
    const snapshot = await getDocs(blogQuery);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error fetching all blog posts:', error);
    throw error;
  }
};

// Get single blog post by ID
export const getBlogPostById = async (postId) => {
  try {
    const docRef = doc(db, 'blog_posts', postId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data()
      };
    } else {
      throw new Error('Blog post not found');
    }
  } catch (error) {
    console.error('Error fetching blog post:', error);
    throw error;
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
    
    if (snapshot.empty) {
      throw new Error('Blog post not found');
    }
    
    return {
      id: snapshot.docs[0].id,
      ...snapshot.docs[0].data()
    };
  } catch (error) {
    console.error('Error fetching blog post by slug:', error);
    throw error;
  }
};

// Create a new blog post (requires authentication)
export const createBlogPost = async (blogData) => {
  try {
    // Check if user is authenticated
    const currentUser = getCurrentUser();
    if (!currentUser) {
      throw new Error('Authentication required');
    }
    
    // Generate a slug from the title
    const slug = blogData.title
      .toLowerCase()
      .replace(/[^\w\s]/gi, '')
      .replace(/\s+/g, '-');
    
    // Add timestamps and author info
    const newBlog = {
      ...blogData,
      slug,
      author: {
        uid: currentUser.uid,
        displayName: currentUser.displayName || 'Anonymous',
        email: currentUser.email
      },
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };
    
    const docRef = await addDoc(collection(db, 'blog_posts'), newBlog);
    return { 
      id: docRef.id,
      ...newBlog
    };
  } catch (error) {
    console.error('Error creating blog post:', error);
    throw error;
  }
};

// Update an existing blog post (requires authentication)
export const updateBlogPost = async (postId, blogData) => {
  try {
    // Check if user is authenticated
    const currentUser = getCurrentUser();
    if (!currentUser) {
      throw new Error('Authentication required');
    }
    
    // Get the existing blog post
    const docRef = doc(db, 'blog_posts', postId);
    const docSnap = await getDoc(docRef);
    
    if (!docSnap.exists()) {
      throw new Error('Blog post not found');
    }
    
    // Check if current user is the author
    const blogPost = docSnap.data();
    if (blogPost.author?.uid !== currentUser.uid) {
      throw new Error('You do not have permission to edit this blog post');
    }
    
    // Generate a new slug if title has changed
    let slug = blogPost.slug;
    if (blogData.title && blogData.title !== blogPost.title) {
      slug = blogData.title
        .toLowerCase()
        .replace(/[^\w\s]/gi, '')
        .replace(/\s+/g, '-');
    }
    
    // Update the blog post
    const updatedBlog = {
      ...blogData,
      slug,
      updatedAt: serverTimestamp()
    };
    
    await updateDoc(docRef, updatedBlog);
    
    return {
      id: postId,
      ...updatedBlog
    };
  } catch (error) {
    console.error('Error updating blog post:', error);
    throw error;
  }
};

// Delete a blog post (requires authentication)
export const deleteBlogPost = async (postId) => {
  try {
    // Check if user is authenticated
    const currentUser = getCurrentUser();
    if (!currentUser) {
      throw new Error('Authentication required');
    }
    
    // Get the existing blog post
    const docRef = doc(db, 'blog_posts', postId);
    const docSnap = await getDoc(docRef);
    
    if (!docSnap.exists()) {
      throw new Error('Blog post not found');
    }
    
    // Check if current user is the author
    const blogPost = docSnap.data();
    if (blogPost.author?.uid !== currentUser.uid) {
      throw new Error('You do not have permission to delete this blog post');
    }
    
    // Delete the blog post
    await deleteDoc(docRef);
    
    return { success: true };
  } catch (error) {
    console.error('Error deleting blog post:', error);
    throw error;
  }
};

// Get blog posts by category
export const getBlogPostsByCategory = async (category) => {
  try {
    const blogQuery = query(
      collection(db, 'blog_posts'),
      where('category', '==', category),
      orderBy('createdAt', 'desc')
    );
    
    const snapshot = await getDocs(blogQuery);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error fetching blog posts by category:', error);
    throw error;
  }
};

// Get blog posts by tag
export const getBlogPostsByTag = async (tag) => {
  try {
    const blogQuery = query(
      collection(db, 'blog_posts'),
      where('tags', 'array-contains', tag),
      orderBy('createdAt', 'desc')
    );
    
    const snapshot = await getDocs(blogQuery);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error fetching blog posts by tag:', error);
    throw error;
  }
}; 
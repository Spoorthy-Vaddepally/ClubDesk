import { useState, useEffect } from 'react';
import { db, auth } from '../firebase';
import { doc, arrayUnion, arrayRemove, increment, getDoc, runTransaction } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';

export const useFollowClub = (clubId: string) => {
  const [isFollowing, setIsFollowing] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, user => {
      setUserId(user?.uid || null);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!userId || !clubId) return;

    const checkFollow = async () => {
      const userDocRef = doc(db, 'users', userId);
      const userSnap = await getDoc(userDocRef);
      if (userSnap.exists()) {
        const userData = userSnap.data();
        setIsFollowing(userData.followedClubs?.includes(clubId) || false);
      }
    };

    checkFollow();
  }, [userId, clubId]);

  const followClub = async () => {
    if (!userId || !clubId) return;

    const userRef = doc(db, 'users', userId);
    const clubRef = doc(db, 'clubs', clubId);

    try {
      await runTransaction(db, async (transaction) => {
        const clubDoc = await transaction.get(clubRef);
        if (!clubDoc.exists()) throw new Error('Club not found');

        transaction.update(clubRef, {
          followersCount: increment(1)
        });
        transaction.update(userRef, {
          followedClubs: arrayUnion(clubId)
        });
      });
      setIsFollowing(true);
    } catch (error) {
      console.error('Failed to follow club:', error);
    }
  };

  const unfollowClub = async () => {
    if (!userId || !clubId) return;

    const userRef = doc(db, 'users', userId);
    const clubRef = doc(db, 'clubs', clubId);

    try {
      await runTransaction(db, async (transaction) => {
        const clubDoc = await transaction.get(clubRef);
        if (!clubDoc.exists()) throw new Error('Club not found');

        transaction.update(clubRef, {
          followersCount: increment(-1)
        });
        transaction.update(userRef, {
          followedClubs: arrayRemove(clubId)
        });
      });
      setIsFollowing(false);
    } catch (error) {
      console.error('Failed to unfollow club:', error);
    }
  };

  return { isFollowing, followClub, unfollowClub, loading };
};

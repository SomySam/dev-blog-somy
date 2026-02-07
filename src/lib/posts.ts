import {
    collection,
    doc,
    addDoc,
    getDoc,
    getDocs,
    updateDoc,
    deleteDoc,
    query,
    orderBy,
    limit,
    where,
    Timestamp,
    startAfter, // 추가
    onSnapshot, // 추가
} from "firebase/firestore";
import { db } from "./firebase";
import type { Post, PostInput, PostSummary, User, Category } from "../types";
import type { QueryDocumentSnapshot, DocumentData } from "firebase/firestore"; // 추가

const postsCollection = collection(db, "posts");

export async function createPost(
    input: PostInput,
    user: User,
): Promise<string> {
    const now = Timestamp.now();

    const postData = {
        title: input.title,
        content: input.content,
        category: input.category,
        authorId: user.uid,
        authorEmail: user.email,
        authorDisplayName: user.displayName,
        createdAt: now,
        updatedAt: now,
    };

    const docRef = await addDoc(postsCollection, postData);
    return docRef.id;
}

export async function getPosts(limitCount: number = 5): Promise<PostSummary[]> {
    const q = query(
        postsCollection,
        orderBy("createdAt", "desc"),
        limit(limitCount),
        // where('category', '==', 'react')
    );

    const snapshot = await getDocs(q);

    return snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
            id: doc.id,
            title: data.title,
            category: data.category,
            authorEmail: data.authorEmail,
            authorDisplayName: data.authorDisplayName,
            createdAt: data.createdAt,
        };
    });
}

export async function getPost(postId: string): Promise<Post | null> {
    const docRef = doc(db, "posts", postId);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
        return null;
    }

    return {
        id: docSnap.id,
        ...docSnap.data(),
    } as Post;
}

export async function updatePost(
    postId: string,
    input: PostInput,
): Promise<void> {
    const docRef = doc(db, "posts", postId);

    await updateDoc(docRef, {
        title: input.title,
        content: input.content,
        category: input.category,
        updatedAt: Timestamp.now(),
    });
}

export async function deletePost(postId: string): Promise<void> {
    const docRef = doc(db, "posts", postId);
    await deleteDoc(docRef);
}

export async function getPostsByCategory(
    category: Category,
    limitCount: number = 20,
): Promise<PostSummary[]> {
    const q = query(
        postsCollection,
        where("category", "==", category),
        orderBy("createdAt", "desc"),
        limit(limitCount),
    );

    const snapshot = await getDocs(q);

    return snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
            id: doc.id,
            title: data.title,
            category: data.category,
            authorEmail: data.authorEmail,
            authorDisplayName: data.authorDisplayName,
            createdAt: data.createdAt,
        };
    });
}

export interface GetPostsOptions {
    /** 카테고리 필터 (null이면 전체) */
    category?: Category | null;
    /** 조회할 개수 */
    limitCount?: number;
    /** 페이지네이션 커서 (이전 쿼리의 마지막 문서) */
    lastDoc?: QueryDocumentSnapshot<DocumentData> | null;
}

export interface GetPostsResult {
    posts: PostSummary[];
    lastDoc: QueryDocumentSnapshot<DocumentData> | null;
    hasMore: boolean;
}

export async function getPostsWithOptions(
    options: GetPostsOptions = {},
): Promise<GetPostsResult> {
    const { category = null, limitCount = 5, lastDoc = null } = options;

    // 쿼리 조건들을 배열로 구성
    const constraints = [];

    // 카테고리 필터 (Day 1 POST-006)
    if (category) {
        constraints.push(where("category", "==", category));
    }

    // 정렬 (Day 1 POST-002: 최신순)
    constraints.push(orderBy("createdAt", "desc"));

    // 페이지네이션: 이전 페이지의 마지막 문서 이후부터
    if (lastDoc) {
        constraints.push(startAfter(lastDoc));
    }

    // 개수 제한 (+1로 다음 페이지 존재 여부 확인)
    constraints.push(limit(limitCount + 1));

    // 쿼리 실행
    const q = query(postsCollection, ...constraints);
    const snapshot = await getDocs(q);

    // hasMore 판단: limitCount + 1개를 요청했으므로
    const hasMore = snapshot.docs.length > limitCount;

    // 실제 반환할 문서들 (limitCount개만)
    const docs = hasMore ? snapshot.docs.slice(0, limitCount) : snapshot.docs;

    const posts = docs.map((doc) => {
        const data = doc.data();
        return {
            id: doc.id,
            title: data.title,
            category: data.category,
            authorEmail: data.authorEmail,
            authorDisplayName: data.authorDisplayName,
            createdAt: data.createdAt,
        };
    });

    return {
        posts,
        lastDoc: docs.length > 0 ? docs[docs.length - 1] : null,
        hasMore,
    };
}

export function subscribeToPostsRealtime(
    callback: (posts: PostSummary[]) => void,
    options: { category?: Category | null; limitCount?: number } = {},
    onError?: (error: Error) => void,
): () => void {
    const { category = null, limitCount = 20 } = options;

    const constraints = [];

    if (category) {
        constraints.push(where("category", "==", category));
    }

    constraints.push(orderBy("createdAt", "desc"));
    constraints.push(limit(limitCount));

    const q = query(postsCollection, ...constraints);

    // onSnapshot은 구독 해제 함수를 반환
    return onSnapshot(
        q,
        (snapshot) => {
            const posts = snapshot.docs.map((doc) => {
                const data = doc.data();
                return {
                    id: doc.id,
                    title: data.title,
                    category: data.category,
                    authorEmail: data.authorEmail,
                    authorDisplayName: data.authorDisplayName,
                    createdAt: data.createdAt,
                };
            });

            callback(posts);
        },
        (error) => {
            if (onError) {
                onError(error);
            }
        },
    );
}

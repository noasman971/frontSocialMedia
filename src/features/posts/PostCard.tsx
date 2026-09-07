import type { Post } from "./posts.api";

type PostCardProps = {
    // we ensure that the post card contain a Post (id, content, author)
    post: Post;
};

export function PostCard({ post }: PostCardProps) {
    return (
        <article className="py-4 space-y-3">
            {/* Header Post */}
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                    <div className="w-9 h-9 rounded-full bg-story-gradient p-[2px] flex items-center justify-center">
                        <div className="w-full h-full rounded-full bg-bg border border-bg flex items-center justify-center text-xs font-semibold uppercase text-text-primary">
                            {/* No profile pic for now, so just the first 2 chars of the username*/}
                            {post.author.username.slice(0, 2)}
                        </div>
                    </div>
                    <div>
                        <span className="font-semibold text-xs text-text-primary hover:text-text-secondary cursor-pointer">
                            {post.author.username}
                        </span>
                        {/* TODO: Date formatting */}
                        <span className="text-[11px] text-text-tertiary ml-2">Date ?</span>
                    </div>
                </div>
                <button className="text-text-secondary hover:text-text-primary text-sm">Option ?</button>
            </div>

            {/* Post Content */}
            <div className="text-sm text-text-primary leading-relaxed">
                <span className="font-semibold text-xs mr-2">{post.author.username}</span>
                {post.content}
            </div>
        </article>
    );
}


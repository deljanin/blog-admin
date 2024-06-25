import Markdown from 'react-markdown';
let about = `## About Me

Greetings! I'm Petar Deljanin, a tech enthusiast, avid reader, and aspiring software developer. Welcome to my blog, where I document my journey as I explore new technologies, delve into books, and learn about business and life. 

## Purpose and Goals

I started this blog to share my experiences and insights with like-minded individuals who are passionate about continuous learning and personal growth. My goal is to create a space where we can learn together and inspire each other and learn something new from each other, or from this blog itself.

## Topics I Cover

- **Technology**: From basics of programming languages and frameworks to the latest trends in the tech world.
- **Books**: Reviews, summaries, and discussions on self help, spirituality and self-improvement, mostly.
- **Business**: Insights into what I learn along the way from various sources.
- **Life Lessons**: Learning how to play and hopefully beat the game of life.

## About the Project

This blog is built using [Next.js](https://nextjs.org/), [Tailwind CSS](https://tailwindcss.com/), [shadcn-ui](https://ui.shadcn.com/), [Next server-less Postgres DB](https://vercel.com/storage/postgres), [Drizzle](https://orm.drizzle.team/) ORM, [Ollama](https://ollama.com/) and [Clerk](https://clerk.com/).

I've integrated post recommendation using embeddings with llama3. With Ollama I created a list of recommended posts and when creating a new post I use cosine similarity with the embeddings to create a list of recommended posts. I took this idea from [here](https://simonwillison.net/2023/Oct/23/embeddings/).

You can find the source code and how to setup the project locally on the [github](https://github.com/deljanin/blog) repository of this blog.

## Get in Touch

Feel free to reach out to me via email at [petar@deljanin.dev](mailto:petar@deljanin.dev) or via my social media:
- [LinkedIn](https://www.linkedin.com/in/petardeljanin)
- [Instagram](https://www.instagram.com/petardeljanin/)

I'm always open to feedback, collaborations, and discussions. 
Thank you for visiting my blog. Let's learn and grow together!

---
`;
export default function About() {
  return (
    <div className="p-5 lg:mx-auto max-w-2xl animate-fade-in">
      <h1 className="pt-5 text-center text-3xl font-bold leading-tight tracking-tighter md:text-5xl lg:leading-[1.1]  md:block">
        About
      </h1>
      <Markdown className="pt-5 prose dark:prose-invert">{about}</Markdown>
    </div>
  );
}

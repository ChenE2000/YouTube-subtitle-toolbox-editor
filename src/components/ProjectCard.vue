<template>
  <div class="blog-card">
    <div class="meta">
      <div class="photo" :style="{ 'backgroundImage': `url(${project.thumbnail})` }"></div>
      <ul class="details">
        <li class="author">YouTube ID: {{ project.id }}</li>
        <li class="date">Publish at: {{ project.upload_date }}</li>
        <!-- <li class="tags"> -->

        <li class="date">Preview {{ project.exist_preview ? "ready" : "needed" }}</li>
        <li class="date">Subtitle {{ project.exist_vtt ? "ready" : "needed" }}</li>

        <!-- </li> -->
      </ul>
    </div>
    <div class="description">
      <h1>{{ project.title }}</h1>
      <h2>{{ project.channel }}</h2>
      <p>{{ project.description.slice(0, 100) }}</p>
      <p class="read-more">
        <a @click="onEdit">Edit</a>
      </p>
    </div>
  </div>
  <!-- <div class="blog-card alt">
    <div class="meta">
      <div class="photo" style="background-image: url(https://storage.googleapis.com/chydlx/codepen/blog-cards/image-2.jpg)"></div>
      <ul class="details">
        <li class="author"><a href="#">Jane Doe</a></li>
        <li class="date">July. 15, 2015</li>
        <li class="tags">
          <ul>
            <li><a href="#">Learn</a></li>
            <li><a href="#">Code</a></li>
            <li><a href="#">JavaScript</a></li>
          </ul>
        </li>
      </ul>
    </div>
    <div class="description">
      <h1>Mastering the Language</h1>
      <h2>Java is not the same as JavaScript</h2>
      <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ad eum dolorum architecto obcaecati enim dicta praesentium, quam nobis! Neque ad aliquam facilis numquam. Veritatis, sit.</p>
      <p class="read-more">
        <a href="#">Read More</a>
      </p>
    </div>
  </div> -->
</template>

<script setup lang="ts">
import { message } from 'ant-design-vue';

const router = useRouter();
const props = defineProps<{
  project: {
    id: number;
    title: string;
    channel: string;
    thumbnail: string;
    description: string;
    exist_preview: boolean;
    exist_vtt: boolean;
    upload_date: string;
  }
}>();


const onEdit = () => {
 if (props.project.exist_preview && props.project.exist_vtt) {
   router.push(`/editor/${props.project.id}`);
 } else {
   message.error('Preview or Subtitle is not ready');
 }
}

</script>

<style scoped>
@charset "UTF-8";

* {
  box-sizing: border-box;
  --card-color: #e93323;
}


.blog-card {
  display: flex;
  flex-direction: column;
  margin: 1rem auto;
  box-shadow: 0 3px 7px -1px rgba(0, 0, 0, 0.1);
  margin-bottom: 1.6%;
  background: #fff;
  line-height: 1.4;
  font-family: sans-serif;
  border-radius: 5px;
  overflow: hidden;
  z-index: 0;
}

.blog-card a {
  color: inherit;
}

.blog-card a:hover {
  color: var(--card-color);
}

.blog-card:hover .photo {
  transform: scale(1.3) rotate(3deg);
}

.blog-card .meta {
  position: relative;
  z-index: 0;
  height: 200px;
}

.blog-card .photo {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-size: cover;
  background-position: center;
  transition: transform 0.2s;
}

.blog-card .details,
.blog-card .details ul {
  margin: auto;
  padding: 0;
  list-style: none;
}

.blog-card .details {
  position: absolute;
  top: 0;
  bottom: 0;
  left: -100%;
  margin: auto;
  transition: left 0.2s;
  background: rgba(0, 0, 0, 0.6);
  color: #fff;
  padding: 10px;
  width: 100%;
  font-size: 0.9rem;
}

.blog-card .details a {
  -webkit-text-decoration: dotted underline;
  text-decoration: dotted underline;
}

.blog-card .details ul li {
  display: inline-block;
}

.blog-card .details .author:before {
  font-family: FontAwesome;
  margin-right: 10px;
  content: "";
}

.blog-card .details .date:before {
  font-family: FontAwesome;
  margin-right: 10px;
  content: "";
}

.blog-card .details .tags ul:before {
  font-family: FontAwesome;
  content: "";
  margin-right: 10px;
}

.blog-card .details .tags li {
  margin-right: 2px;
}

.blog-card .details .tags li:first-child {
  margin-left: -4px;
}

.blog-card .description {
  padding: 1rem;
  background: #fff;
  position: relative;
  z-index: 1;
}

.blog-card .description h1,
.blog-card .description h2 {
  font-family: Poppins, sans-serif;
}

.blog-card .description h1 {
  line-height: 1;
  margin: 0;
  font-size: 1.7rem;
}

.blog-card .description h2 {
  font-size: 1rem;
  font-weight: 300;
  text-transform: uppercase;
  color: #a2a2a2;
  margin-top: 5px;
}

.blog-card .description .read-more {
  text-align: right;
}

.blog-card .description .read-more a {
  color: var(--card-color);
  display: inline-block;
  position: relative;
}

.blog-card .description .read-more a:after {
  content: "";
  font-family: FontAwesome;
  margin-left: -10px;
  opacity: 0;
  vertical-align: middle;
  transition: margin 0.3s, opacity 0.3s;
}

.blog-card .description .read-more a:hover:after {
  margin-left: 5px;
  opacity: 1;
}

.blog-card p {
  position: relative;
  margin: 1rem 0 0;
}

.blog-card p:first-of-type {
  margin-top: 1.25rem;
}

.blog-card p:first-of-type:before {
  content: "";
  position: absolute;
  height: 5px;
  background: var(--card-color);
  width: 35px;
  top: -0.75rem;
  border-radius: 3px;
}

.blog-card:hover .details {
  left: 0%;
}

@media (min-width: 640px) {
  .blog-card {
    flex-direction: row;
    width: 1000px;
  }

  .blog-card .meta {
    flex-basis: 50%;
    height: auto;
  }

  .blog-card .description {
    flex-basis: 60%;
  }

  .blog-card .description:before {
    transform: skewX(-3deg);
    content: "";
    background: #fff;
    width: 30px;
    position: absolute;
    left: -10px;
    top: 0;
    bottom: 0;
    z-index: -1;
  }

  .blog-card.alt {
    flex-direction: row-reverse;
  }

  .blog-card.alt .description:before {
    left: inherit;
    right: -10px;
    transform: skew(3deg);
  }

  .blog-card.alt .details {
    padding-left: 25px;
  }
}</style>
const { gql, default: request } = require("graphql-request");

const MASTER_URL =
  "https://api-ap-south-1.hygraph.com/v2/" +
  process.env.NEXT_PUBLIC_HYGRAPH_API_KEY +
  "/master";

const getAllIssue = async () => {
  const query = gql`
    query MyQuery{
      issueLists{
        id
        errorName
        banner{
          url
        }
        issueDetail{
          name
        }
        issueTag
      }
    }
    `
    const result = await request(MASTER_URL, query);
    return result;
}

const getIssueDetails  = async (issueId) => {
  const query = gql`
  query MyQuery{
      issueList(where: { id: "${issueId}" }){
    errorName
    issueTag
    description
    banner{
      url
    }
    issueDetail{
      name
      author
      activeIssues
      githubLink
    }
  }
    }
    `

    const result = await request(MASTER_URL, query)
    return result
}

const getAllCourseList = async () => {
  const query = gql`
    query MyQuery {
      courseLists(first: 1000, orderBy: createdAt_DESC) {
        slug
        name
        id
        free
        description
        banner {
          url
        }
        chapter {
          ... on Chapter {
            id
            name
            youtubeUrl
          }
        }
        totalChapters
      }
    }
  `;

  const result = await request(MASTER_URL, query);
  return result;
};

const getSideBanner = async () => {
  const query = gql`
    query GetSideBanner {
      sideBanners {
        id
        updates
        updateDetails
      }
    }
  `;

  const result = await request(MASTER_URL, query);
  return result;
};

const getCourseById = async (courseId) => {
  const query = gql`
    query GetCourseById {
      courseList(where: { slug: "${courseId}" }) {
        name
    description
    chapter {
      ... on Chapter {
        id
        name
        youtubeUrl
        chapterNumber
      }
    }
    id
    free
    slug
    tag
    totalChapters
    author
      }
    }
  `;

  const result = await request(MASTER_URL, query);
  return result;
};

const enrollToCourse = async (courseId, email) => {
  const query =
    gql`
  mutation MyMutation {
    createUserEnrollCourse(
      data: {courseId: "` +
    courseId +
    `", userEmail: "` +
    email +
    `", courseList: {connect: {slug: "` +
    courseId +
    `"}}}
    ) {
      id
    }
    publishManyUserEnrollCoursesConnection {
      edges {
        node {
          id
        }
      }
    }
  }
 `;

  const result = await request(MASTER_URL, query);
  return result;
};

const checkUserEnrolledToCourse = async (courseId, email) => {
  const query =
    gql`
    query MyQuery {
      userEnrollCourses(where: { courseId: "` +
    courseId +
    `", userEmail: "` +
    email +
    `" }) {
        id
      }
    }
  `;
  const result = await request(MASTER_URL, query);
  return result;
};

const getUserEnrolledCourseDetails = async (id, email) => {
  const query =
    gql`
    query MyQuery {
      userEnrollCourses(
        where: {
          id: "` +
    id +
    `"
          userEmail: "` +
    email +
    `"
        }
      ) {
        courseId
        id
        userEmail
        completedCourse {
          ... on CompleteCourse {
            id
            chapterId
          }
        }
        courseList {
          author
          banner {
            url
          }
          chapter (first: 1000){
            ... on Chapter {
              id
              name
              youtubeUrl
              code
            }
          }
          description
          free
          id
          name
          slug
          tag
          totalChapters
        }
      }
    }
  `;

  const result = await request(MASTER_URL, query);
  return result;
};

const markChapterCompleted = async (enrollId, chapterId) => {
  const query =
    gql`
    mutation MyMutation {
      updateUserEnrollCourse(
        data: {
          completedCourse: { create: { CompleteCourse: { chapterId: "` +
    chapterId +
    `" } } }
        }
        where: { id: "` +
    enrollId +
    `" }
      ){
        id
      }
      publishUserEnrollCourse(where: { id: "` +
    enrollId +
    `" }) {
        id
      }
    }
  `;

  const result = await request(MASTER_URL, query);
  return result;
};

const getUserAllEnrolledCourseList = async () => {
  const query = gql`
    query MyQuery {
      userEnrollCourses(where: { userEmail: "mrinalbitsat@gmail.com" }) {
        completedCourse {
          ... on CompleteCourse {
            id
            chapterId
          }
        }
        courseId
        courseList {
          author
          free
          id
          name
          slug
          totalChapters
          description
          chapter {
            ... on Chapter {
              id
              name
            }
          }
          banner {
            url
          }
        }
      }
    }
  `;

  const result = await request(MASTER_URL, query);
  return result;
};

export default {
  getAllCourseList,
  getSideBanner,
  getCourseById,
  enrollToCourse,
  checkUserEnrolledToCourse,
  getUserEnrolledCourseDetails,
  markChapterCompleted,
  getUserAllEnrolledCourseList,
  getIssueDetails,
  getAllIssue
};

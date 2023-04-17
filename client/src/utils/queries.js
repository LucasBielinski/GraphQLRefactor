// sets what info i need for the query
import { gql } from "@apollo/client";

export const QUERY_ME = gql`
  query me {
    me {
      _id
      username
      email
      bookCount
      savedBooks {
        bookId
        authors
        title
        link
        image
      }
    }
  }
`;

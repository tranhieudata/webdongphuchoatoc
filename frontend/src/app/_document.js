// pages/_document.js
import Document, { Html, Head, Main, NextScript } from 'next/document';

class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          {/* Bootstrap CSS */}
          <link
            rel="stylesheet"
            href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css"
            integrity="sha384-9a3b8eb0b72f3e520aee195f0c3b1a76a12f9a13ac99b20a24e2f702f7cf3e19"
            crossOrigin="anonymous"
          />
          
        </Head>
        <body>
          <Main />
          <NextScript />
          {/* Bootstrap JS và Popper.js được tải sau khi nội dung trang đã được tải */}
          <script
            src="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/js/bootstrap.bundle.min.js"
            integrity="sha384-9a3b8eb0b72f3e520aee195f0c3b1a76a12f9a13ac99b20a24e2f702f7cf3e19"
            crossOrigin="anonymous"
          ></script>
        </body>
      </Html>
    );
  }
}

export default MyDocument;

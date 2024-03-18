const express = require("express");
const router = express.Router();

const data = [
    {
        id: 1,
        title: "How to create a new Django project?",
        content: {
            text: "Just use django-admin lol!",
            html: `<p>s</p><pre class="ql-syntax" spellcheck="false">.content-preview {
              &nbsp; &nbsp; text-align: left;
              &nbsp; &nbsp; display: flex;
              &nbsp; &nbsp; align-items: flex-start;
              &nbsp; &nbsp; flex-direction: column;
              &nbsp; &nbsp; padding: 5px;
              }
              
              
              .content-preview p {
              &nbsp; &nbsp; overflow-wrap: anywhere;
              }
              .content-preview div {
              &nbsp; &nbsp; width: 100%;
              }
              .content-preview code {
              &nbsp; &nbsp; width: 100%;
              &nbsp; &nbsp; white-space: break-spaces !important;
              }
              .content-preview pre {
              &nbsp; &nbsp; width: 100%;
              }
              </pre>`,
        },
        views: 10,
        tags: [
            "How to create a new Django project?",
            "haha",
            "How to create a new Django project?",
            "ngu",
        ],
        answers: [
            {
                id: 1,
                content: `Just use django-admin lol! to find out more about django, visit <a href="https://docs.djangoproject.com/en/3.1/">https://docs.djangoproject.com/en/3.1/</a>`,
            },
            {
                id: 1,
                content: "<b>You so beauty</b>",
            },
        ],
        author: {
            id: 1,
            username: "admin",
            email: "gamemod@pro",
        },
        created_at: "2020-04-01T10:00:00Z",
    },
];

router.get("/", (req, res) => {
    res.send(data);
});

router.get("/:id", (req, res) => {
    res.send(data.find((x) => x.id == req.params.id));
});

router.post("/", (req, res) => {
    console.log(req.body);
});

module.exports = router;

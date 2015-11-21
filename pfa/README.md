# Anonymous mini twitter service

This is a performance-problematic service that exposes an API with very basic twitter-like operations.

Features:

- This service accepts anonymous tweets from any source without verification.
- Tweets should be limited to 140 characters.
- Tweets may be erased from the server after an arbitrary amount of time.

-----------------------

# The problems

There are several performance problems in this application.
Although every test should be passing, there are no benchmarks written yet and
many usage scenarios are not covered in the tests.

1. Create benchmarks
    - Measure response times; average and max
    - Throughput
2. Load test
    - Script load generation for every endpoint
3. Monitor
    - Availability
    - Memory usage
    - CPU usage
    - Event loop delays
    - GC activity
    - Network bandwith used (all interfaces)

Focus on using the techniques and tools you learned about instead of trying
to read the codebase.
Some parts of the codebase were specifically written with the purpose
of discouraging you from reading the code.

-----------------------

# Setup for development

### Prerequisites

MongoDB needs to be running on its default port.

To install dependencies, run

```bash
$ npm install
```

### Run tests

Run:

```bash
$ npm test
```

### Start

Run:

```bash
$ npm start
```

Service should be up on port 7070.
Use the environment variable `PORT` to specify another port.

### Deploy

Run:

```bash
$ npm run-script deploy root@<your-instance-ip>
```

-----------------------

# The API

### GET /statuses

Example response:

```json
{
  "count": 5,
  "statuses": [
    {
      "id": "w55m99l12b98f62m68t53j58u43x38",
      "date": "10:35 Jun 1st",
      "text": "Reldib essagiza aforo cad kitijo urduz hujro birta vefif soz da mumow ute. ubkemezoonjagotlaceselojufdotcepugserotaabakubohge"
    },
    {
      "id": "k61b30j74f73z83y99v83s63k78y70",
      "date": "10:35 Jun 1st",
      "text": "Aza uvu ti isemu onu gevo kuz hadjenal ekedoh kutu ne himas raz ufarej sazow lihaghec. Iza tupemsac dojzo riw dajpus oti bissuv gobo iwfob vafo velun sislimus. Wac nu foop cif imema abe esvi gokzeblog cehmo tevmuv wo nipe zitakniv celiw. Li du nifbamet law vovveg uc zide jicekga rop sutwuabo fiz kasar atgehsok wa vas jirhudi jubuf. Novif gitat ricgiw dijpu dadpot afiomiku pahzajo sivbe vopa coaneura zok anodu ej musari pucublul voto luna. Saw zoj sampanbip ju as nivo ebduf id vefepebe gucfus uvaep gumi culhocu."
    },
    {
      "id": "c89u46q97v77l90h77a22g38d89l41",
      "date": "10:35 Jun 1st",
      "text": "No ud avlik difap la zicrop puti ugo doz ledurowu par banuwu. Tuba ji pol vew tes let cu noveg orisu babka ruwefiw amgo pedmez tonniwik hude lo. Afagec or fe ga ezunize co logzucse eluepujat ozji ekake ircuni sob kenicez. Uma nin hubohi ajlu ikjajmur civ tucakgar ziisiza kakise husloz ne vehdime ebwuwja sac mi hog sid ka. Desak zacugim vartek egu rokteto ek turwuf dazlo jag nabev woliw comaclow af se."
    },
  ]
}
```

### POST /statuses

Example request body:

```json
{
  "status": "Chase mice for stare at ceiling yet hopped up on goofballs"
}
```

Response has no body and status code is 201.
If the tweet exceeds 140 characters response code will be 413.

### POST /search

Searches for statuses containing the supplied words.

Example request body:

```
[
  "foo",
  "bar"
]
```

Example response:

```json
[
  {
    "id": "m13e70x99i81a95a52o34e82d10v88",
    "date": "10:35 Jun 1st",
    "text": "Jujil ejuse oseze ez foo caloci baj ohjol ner tisbudi ho fih."
  },
  {
    "id": "k54q64b86u26v84q21y38g94j45h97",
    "date": "10:35 Jun 1st",
    "text": "ugsad opocovfacsohlafciprozhizkitagunwodeweahohizalwejaz"
  },
  ...
]
```

### GET /stats

Provides a recent endpoint usage count.

Example response:

```json
{
  "GET /statuses": 8,
  "POST /statuses": 4,
  "POST /search": 5,
  "GET /stats": 3
}
```

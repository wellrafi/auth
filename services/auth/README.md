# DIARY APP - wellrafi.com 

## Tentang
projek ini adalah sebuah projek untuk membuat jurnal keseharian dari kegiatan sehari-hari, dibuatkan online karena
kita tidak setiap hari membawa buku jurnal kita, karena merepotkan membawa buku & pulpen kemana2. Jadi saya buat
buku jurnal harian yang bisa dibuka di semua device terutama di smartphone karena pasti semua orang membawa smartphone 
mereka kemana2.

## Teknologi
di projek ini saya menggunakan nodejs untuk bagian server, kenapa saya menggunakan NodeJS? karena nodejs itu menggunakan
javascript dan juga cepat, dan untuk bagian frontend website saya menggunakan ReactJS, untuk desktop saya menggunakan
electron & untuk smartphone (android) saya menggunakan React Native. kenapa saya menggunakan NodeJS, ReactJS, Electron
& React Native karena hanya perlu menggunakan 1 bahasa yaitu Javascript sudah bisa digunakan untuk hampir semuanya.

## Design
walau saya hanya punya skill basic pada design, tapi saya mencoba untuk menggunakan design yang minimalis dan modern

## Endpoint
kumpulan beberapa endpoint yang wajib diketahui

#### REGISTRASI / TAMBAH USER 
  
  * **POST** ``/v1/signup``

    di endpoint ini request body dibagi jadi dua yang pertama ``Array`` yang tujukan untuk menambah data user lebih dari satu oleh admin 
    dan yang kedua ``Object`` ditujukan untuk user registrasi

    Example (Admin & Multiple)

    ```javascript
      let arrayData = [
        {
          username: "username1", // required
          password: "password1", // required
          name: "rafiroyhan",
          email: "rafiroyhan@gmail.com",
          photo: "https://i.pravatar.cc/300",
          address: "lampung timur",
          postCode: "34381",
          phoneNumber: 0878779545,
          birthday: "2001-02-17"
        },
        {
          username: "username2", // required
          password: "password2", // required
          name: "javas kadafi",
          email: "javaskadafi@gmail.com",
          photo: "https://i.pravatar.cc/300", // from url or base64 string
          address: "lampung timur",
          postCode: "34381",
          phoneNumber: 081919157645,
          birthday: "2014-06-14"
        }
      ]

      fetch('http://auth.wellrafi/v1/signup', {
        method: "POST",
        body: arrayData
      }).then(res => res.json())
      .then(result => {
        console.log(result) 
        // {
        //   "message": "Created",
        //   "success": 1
        // }
      })

    ```

    Example (User)

    ```javascript
    let obData = {
      username: "username1", // required
      password: "password1", // required
      name: "rafiroyhan",
      email: "rafiroyhan@gmail.com",
      photo: "https://i.pravatar.cc/300", // from url or base64 string
      address: "lampung timur",
      postCode: "34381",
      phoneNumber: 0878779545,
      birthday: "2001-02-17"
    },
      
    fetch('http://auth.wellrafi/v1/signup', {
      method: "POST",
      body: obData
    }).then(res => res.json())
    .then(result => {
      console.log(result);
      // return username, name, photo, accessToken & refreshToken
      // {
        //message": "Created",
      //"success": 1,
      //"accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJsb2dnZWQiOjEsIl9pZCI6IjMyZWU2Njg0LWEzYjItNDk2MS05YzljLTY4MTY5YjljNjFiNyIsImlhdCI6MTU4NzE3NTY0MiwiZXhwIjoxNTg3MjExNjQyfQ0140fe1229a6b03a7cb58ad42250cc97ec1c96be7f01fcb392d3db8051ac02c2e7c19d4194b3c76f9840fd818418564e8dec735fa90090cade430f264712af86c1bb0913106369947bea7a05a94f120167a2a1da9b6eb10afc8e60dc3706126acda242fa9ecbddc8ab385985a72fa2d3f2354cecff2b746c34292c29fc4edd91.-PBiqK2-BkKGSluU6xwbkEzGtoUKDABuQF9s1_7FrSA",
      //"refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfdG9rZW4iOiI1NDZhMWZjNDQ5NTYyZWFmNWY2MWJjMDk3NmM5NGZiOWNkZTBjNzZlMjJkNzc2ZDg0MzhmZGE4YjIzODlmYWRhZDRjMDEwMWVlN2E3YjM3ZmUxMmNhYjU0NWFiYjM5MTY3NGY1MTVhNmQ1ZDFkYmVkZjIyNjdiYzQ5ZTgwMzFhYyIsImlhdCI6MTU4NzE3NTY0MiwiZXhwIjoxNTg5NzY3NjQyfQ736401b02306dc5ee0e3896797d917c8612899d71f2f494fac37355cd65f7b9d277b93a945296b2314b2af367a89640eb82cf5fa33ba842fd2413215993e7b816f2eba848a5958d41bfa1e6e4cf6b104274103da8a2aa6c58c975dd5ea6b352cb802cb67ecb22793cdc4f49df73026a8c0c5f092452fb6222f9aa49e9ba8aee4.N6zM9QH_WbusC_vQG7iXiFz2bfypVDwoq-uOyD5yNoU",
      //"username": "use1rname1",
      //"name": "rafioryhan",
      //"photo": null
      // }
    })
    ```


# ROADMAP
### Server
* [ ] REGISTER - ENDPOINT
* [ ] LOGIN - ENDPOINT

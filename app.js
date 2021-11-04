    const query = document.getElementById('search')
    const submitBtn = document.getElementById('submit')
    // const BASE_URL = 'http://localhost:5000/api/words'
    const BASE_URL = 'https://dictionary-search-words.herokuapp.com/api/words'

    // 특수문자
    function checkIfStringHasSpecialCharacter(str) {
        const re = /[`!@#$%^&*()_+\-=\[\]{};':"\\|.<>\/?~]/;
        return re.test(str);
    }
    // 검색어에 숫자가 들어간 경우 검색이 안되도록 함
    function checkIfStringHasNumbers(str) {
        return /\d/.test(str);
    }
    //영어 문자가 들어간 경우 검색이 안되도록 함
    function checkIfStringHasLetters(str) {
        return /[a-z]/i.test(str) //[a-zA-Z]
    }
    //버튼 비활성화
    function enableSubmitBtn(state){
        submitBtn.disabled = state 
    }
    
    // 서버 데이터 가져오기
    function getData(baseUr1, query){
        enableSubmitBtn(true) //버튼 비활성화
        console.log('서버 접속중...')
        // this.disabled = true //버튼 비활성화
        
        // 사용자 입력 유효성 검증
        if(checkIfStringHasSpecialCharacter(query)){
            enableSubmitBtn(false) //버튼 활성화
            count.innerHTML = "검색 결과 없습니다."
            container.innerHTML = "<h1>Your searh keyword has special character. Retype only hangle !!</h1>"
            return;
        }
        if(checkIfStringHasNumbers(query)){
            enableSubmitBtn(false)
            count.innerHTML = ""
            container.innerHTML = "<h1>Your searh keyword has Numbers. Retype only hangle !!</h1>"
            return;
        }
        if(checkIfStringHasLetters(query)){
            enableSubmitBtn(false)
            count.innerHTML = ""
            container.innerHTML = "<h1>한글 단어를 입력하세요 !</h1>"
            return;
        }

        fetch(`${baseUr1}/${query}`, {
            headers: {
                "Content-Type": "application/json",
            }
        })
        .then(res => res.json())
        .then(data => {
            // submitBtn.disabled = false //버튼 활성화
            enableSubmitBtn(false)

            console.log(data) //추가
            const {words} = data;
            
            if(query.length === 0){ //데이터 유효성 검증
                count.innerHTML = "'" + query + "' 검색 결과 (총 " + 0 + "개)"
                container.innerHTML = "<h1>검색어를 입력하세요</h1>"
                return;
            } 


            const template = words.map(word => {
                return (
                    
                    `
                        <div class="item">
                            <div class="word"><a href = ${word.r_link} target="_blank">
                                ${word.r_word}</a>
                                <sup>${word.r_seq? word.r_seq:""}</sup>
                                ${word.r_chi}
                                ${word.r_pos}
                            </div>
                            <p class="description">${word.r_des}
                                <button type="button" class="btn btn-outline-dark">
                                    <a href = ${word.r_link} target="_blank">자세히 보기</a></button>
                            </p>
                            
                        </div>
                    `
                )
            })
            count.innerHTML = "'" + query + "' 검색 결과 (총 " + words.length + "개)"
            container.innerHTML = template.join("") //DOM 에 Template 삽입
        })
    }
    // 검색창에 검색했을때 화면
    submitBtn.addEventListener('click', function(){
        console.log(query.value)
        getData(BASE_URL, query.value)
        // setTimeout(getData(BASE_URL, query.value), 5000) //5초

    })
    // Enter 키로 검색
    query.addEventListener('keypress', function(e){
        console.log('key pressed')
        if(e.keyCode ===13) {
            getData(BASE_URL, query.value)
        }
    })
    // 처음화면
    window.addEventListener('DOMContentLoaded', function(){
        //getData(BASE_URL)
        getData(BASE_URL, query.value)

    });
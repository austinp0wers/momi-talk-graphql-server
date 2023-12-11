# Momi-talk Assignment

### 환경변수

```
RUNNING_PORT=4000
MYSQL_HOST=localhost
MYSQL_PORT=3308
MYSQL_USERNAME=root
MYSQL_PASSWORD=1234
MYSQL_DATABASE=momi-talk
```

### 실행 방법

```
yarn

yarn start
```

<br />

## 구현 요구사항

- [x] 유저 본인의 정보 조회 (유저의 현재 임신 주차 (Request가 온 시간을 기준으로 한 임신 주차) 필드가 있어야합니다)
- [x] 유저 본인의 정보 수정
- [x] 주차별로 체크리스트 조회 (createdAt 을 기준으로 한 pagination 이 필요합니다.)
- [x] 완료 체크
- [x] 완료 체크 해제
- [x] 리스트에 아이템 추가
- [x] 아이템 수정
- [x] 아이템 삭제
- [x] 아이템 삭제 취소

<br />

## 개발 환경

- Nest.js
- TypeORM (MySQL)
- Graphql (Apollo)

<br />

## 폴더 구조

        ├── src
        │   ├── middlewares                             # Middleware들이 포함되어 있는 폴더 입니다.
        │       └── user-seq.middleware.ts              # userSeq를 확인하고, Int 타입으로 변환해 주는 middleware 입니다. 만약 없는경우 에러를 던집니다.
        │   └── modules                                 # module, resolver, service, repository가 포함되어 있는 폴더입니다.
        │       └── checklist                           # 체크리스트 서비스 단위 입니다.
        │            ├── dto                            # 체크리스트에서 사용하는 dto들을 담은 폴더 입니다.
        │            ├── checklist-item.entity.ts       # 체크리스트 아이템의 entity 파일 입니다.
        │            ├── checklist-item.gql             # 체크리스트 아이템의 graphQL 파일 입니다.
        │            ├── checklist.module.ts            # 체크리스트 모듈 입니다.
        │            ├── checklist.resolver.ts          # 체크리스트 Resolver 입니다.
        │            └── checklist.service.ts           # 체크리스트 관련 쿼리와 로직들이 포함되어있습니다.
        │       └── user                                # 고객 관련 API들이 포함되어 있는 모듈입니다.
        │            ├── entities                       # 유저와 유저의 체크리스트 entity 가 포함되어 있습니다.
        │            ├── services                       # 유저 정보와 유저의 체크리스트 관련 로직과 쿼리가 포함되어 있습니다.
        │            ├── types                          # 유저 관련 로직시 사용되는 type들을 정의 하였습니다.
        │            ├── user.gql                       # 유저의 graphQL 파일 입니다.
        │            ├── user.module.ts                 # 유저의 모듈 입니다.
        │            └── user.resolver.ts               # 유저의 resolver 입니다.
        ├── README.md
        └── packages.json

<br />

## 고민 혹은 문제

- 과거에 회사에서 적용을 해보려고 GraphQL에 대해서 조사를 해 보았던 경험이 있습니다.
  어느정도 이해도가 있다라고 생각을 했었으나 `처음으로 구현`을 해보니 확실히 부족한 점이 많았으며 기본 셋업에서도 많은 에러를 마주하게 되었습니다. `해당 문제는 nestjs의 공식 문서를 보면서 해결을 하였습니다.`
- checklist 아이템 추가시 모든 유저가 볼 수 있지만, 모든 유저의 완료 상태를 개별적으로 관리를 해야 했습니다. 이를 해결 하기 위해 체크리스트 아이템을 추가시, checklist 테이블에 완료 필드를 두는게 아닌, `별도의 user checklist 테이블을 생성해서 완료 여부를 관리` 하였습니다.
- `Optimistic Update` 라는 표현을 처음 들어 보았습니다. 의미를 찾아보니 지금도 과거에도 여러번 고민하고 프론트 엔드 개발자 분들과 대화를 나눴던 주제 였습니다. 용어에 대한 이해도를 넓히고 실제로 이런 고민을 하면서 개발하는 습관을 들여야 겠다고 느꼈습니다.
- "폴더구조를 어떻게 나눴을때 확장성 있게 사용될 수 있을까"를 고민하였습니다.
  `Circular Injection을 피하기 위해서` checklist를 유저와 별도로 분리하였고, 유저모듈이 해당 모듈을 주입받아서 사용하는 구조를 택했습니다. 유저관련 로직과, checklist를 확실히 분리하며 user모듈이 다른 필요한 모듈을 주입받는 형태로 구성하였습니다.
- 폴더구조의 경우 확장이 계속되서 `Microservice 단위로 분리`를 할 수 있도록 구성 하였고, 그럼으로 entity 들이 분리가 되어 있으며, 모듈도 그러한 백그라운드를 바탕으로 분리를 하였습니다.

<br />

## 한계점 및 개선 사항

- 프론트에서 optimistic update를 구현한다고 하였을때, 서버에서 신경을 쓰지 못한거 같습니다. 사실상 프론트에서 요청이 오면, 프론트는 업데이트를 하고 백엔드는 완료 이벤트를 `graphql-subscriptions` 방식으로 전송하려고 하였으나 graphql서버 개발 자체가 처음인 저로서는 시간적으로 조금 부족하였던거 같습니다.
-

## Query & Mutation

### Query

```
<!-- 유저 본인의 정보 조회 -->
query {
  getUser {
    id,
    nickname
    dueDate
    pregnancyWeek
  }
}

<!-- 주차별로 체크리스트 조회 -->
query {
    getChecklistByWeek(weekNumber: 2){
        content
    }
}
```

### Mutation

```
<!-- 유저 정보 수정 -->
mutation{
    updateUser(updateData: {nickname: "오스틴맘", dueDate: "2023-12-24"}){
        id
        nickname
        dueDate
        pregnancyWeek
    }
}
<!-- 체크리스트 아이템 추가 -->
mutation {
    addChecklistItem(itemInput: {
        weekNumber: 2,
        content: "테스팅"
    }) {
        content
        weekNumber
        isCompleted
        isDeleted
    }
}

<!-- 유저 체크리스트 완료 체크 / 해제 -->
mutation {
  toggleUserChecklistItemCompletion(checklistItemId: 1) {
    id
    checklistItem{
        id
        weekNumber
        content
    }
    isCompleted
  }
}

<!-- 아이템 수정 -->
mutation {
    updateChecklistItem(id: 2, updateInput: {
        weekNumber: 3,
        content: "위크 1부터 3으로 수정"
    }) {
        id
        content
        weekNumber
        isCompleted
        isDeleted
    }
}

<!-- 아이템 삭제 -->
mutation {
    deleteChecklistItem(id: 2)
}

<!-- 아이템 삭제 취소 -->
mutation {
    restoreChecklistItem(id: 2){
        id
        content
    }
}


```

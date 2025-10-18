# UML Диаграмма системы Nome.ai

## Диаграмма процесса распознавания лиц и аналитики посетителей

```mermaid
graph TD
    subgraph "User (Пользователь)"
        A[Начало процесса] --> B[Вход в систему]
        B --> C[Просмотр дашборда]
        C --> D[Просмотр деталей клиента]
        D --> E[Анализ AI-инсайтов]
        E --> F[Конец процесса]
    end

    subgraph "Frontend (Next.js)"
        G[Авторизация] --> H[Dashboard страница]
        H --> I[Список клиентов]
        I --> J[Детальная страница клиента]
        J --> K[AI Summary компонент]
        K --> L[WebSocket подключение]
    end

    subgraph "Backend (Django)"
        M[Проверка аутентификации] --> N[Получение списка Person]
        N --> O[Детали Person с корзинами]
        O --> P[AI анализ клиента]
        P --> Q[WebSocket уведомления]
        Q --> R[Статистика посещений]
    end

    subgraph "Database (PostgreSQL + pgvector)"
        S[User таблица] --> T[Person таблица]
        T --> U[Cart таблица]
        U --> V[Product таблица]
        V --> W[Vector embeddings]
    end

    subgraph "AI Services"
        X[OpenAI API] --> Y[Анализ предпочтений]
        Y --> Z[Генерация инсайтов]
    end

    %% Связи между компонентами
    B --> G
    G --> M
    M --> S
    
    C --> H
    H --> I
    I --> N
    N --> T
    
    D --> J
    J --> O
    O --> U
    
    E --> K
    K --> P
    P --> X
    X --> Y
    Y --> Z
    
    L --> Q
    Q --> R
    R --> W

    %% Стили
    classDef userClass fill:#e1f5fe
    classDef frontendClass fill:#f3e5f5
    classDef backendClass fill:#e8f5e8
    classDef databaseClass fill:#fff3e0
    classDef aiClass fill:#fce4ec

    class A,B,C,D,E,F userClass
    class G,H,I,J,K,L frontendClass
    class M,N,O,P,Q,R backendClass
    class S,T,U,V,W databaseClass
    class X,Y,Z aiClass
```

## Диаграмма архитектуры системы

```mermaid
graph TB
    subgraph "Client Layer (Клиентский слой)"
        A[Web Browser] --> B[Next.js Frontend]
        B --> C[React Components]
        C --> D[Material-UI Components]
        C --> E[WebSocket Client]
    end

    subgraph "API Layer (API слой)"
        F[REST API Endpoints] --> G[Authentication]
        F --> H[Person Management]
        F --> I[Statistics]
        F --> J[Cart Management]
        K[WebSocket Endpoints] --> L[Person Events]
    end

    subgraph "Business Logic (Бизнес-логика)"
        M[Person Services] --> N[Vector Recognition]
        M --> O[AI Analysis]
        P[Statistics Services] --> Q[Demographics]
        P --> R[Visit Tracking]
        S[Cart Services] --> T[Order Management]
    end

    subgraph "Data Layer (Слой данных)"
        U[PostgreSQL Database] --> V[User Table]
        U --> W[Person Table]
        U --> X[Cart Table]
        U --> Y[Product Table]
        Z[pgvector Extension] --> AA[Facial Embeddings]
    end

    subgraph "External Services (Внешние сервисы)"
        BB[OpenAI API] --> CC[AI Insights]
        DD[File Storage] --> EE[Images]
    end

    %% Связи
    B --> F
    E --> K
    F --> M
    F --> P
    F --> S
    K --> L
    M --> U
    P --> U
    S --> U
    O --> BB
    W --> Z
    W --> DD

    %% Стили
    classDef clientClass fill:#e3f2fd
    classDef apiClass fill:#f1f8e9
    classDef businessClass fill:#fff8e1
    classDef dataClass fill:#fce4ec
    classDef externalClass fill:#f3e5f5

    class A,B,C,D,E clientClass
    class F,G,H,I,J,K,L apiClass
    class M,N,O,P,Q,R,S,T businessClass
    class U,V,W,X,Y,Z,AA dataClass
    class BB,CC,DD,EE externalClass
```

## Детальная диаграмма архитектуры системы

```mermaid
graph TB
    subgraph "Client Layer (Клиентский слой)"
        A[Web Browser] --> B[Next.js Frontend]
        B --> C[React Components]
        C --> D[Material-UI Components]
        C --> E[WebSocket Client]
    end

    subgraph "API Layer (API слой)"
        F[REST API Endpoints] --> G[Authentication]
        F --> H[Person Management]
        F --> I[Statistics]
        F --> J[Cart Management]
        K[WebSocket Endpoints] --> L[Person Events]
    end

    subgraph "Business Logic (Бизнес-логика)"
        M[Person Services] --> N[Vector Recognition]
        M --> O[AI Analysis]
        P[Statistics Services] --> Q[Demographics]
        P --> R[Visit Tracking]
        S[Cart Services] --> T[Order Management]
    end

    subgraph "Data Layer (Слой данных)"
        U[PostgreSQL Database] --> V[User Table]
        U --> W[Person Table]
        U --> X[Cart Table]
        U --> Y[Product Table]
        Z[pgvector Extension] --> AA[Facial Embeddings]
    end

    subgraph "External Services (Внешние сервисы)"
        BB[OpenAI API] --> CC[AI Insights]
        DD[File Storage] --> EE[Images]
    end

    %% Связи
    B --> F
    E --> K
    F --> M
    F --> P
    F --> S
    K --> L
    M --> U
    P --> U
    S --> U
    O --> BB
    W --> Z
    W --> DD

    %% Стили
    classDef clientClass fill:#e3f2fd
    classDef apiClass fill:#f1f8e9
    classDef businessClass fill:#fff8e1
    classDef dataClass fill:#fce4ec
    classDef externalClass fill:#f3e5f5

    class A,B,C,D,E clientClass
    class F,G,H,I,J,K,L apiClass
    class M,N,O,P,Q,R,S,T businessClass
    class U,V,W,X,Y,Z,AA dataClass
    class BB,CC,DD,EE externalClass
```

## Диаграмма потока данных для распознавания лиц

```mermaid
sequenceDiagram
    participant U as User
    participant F as Frontend
    participant B as Backend
    participant D as Database
    participant AI as AI Service
    participant WS as WebSocket

    U->>F: Открывает дашборд
    F->>B: GET /api/client/persons/
    B->>D: SELECT * FROM person
    D-->>B: Список клиентов
    B-->>F: JSON response
    F-->>U: Отображение клиентов

    F->>WS: WebSocket подключение
    WS-->>F: person_joined event

    U->>F: Клик на клиента
    F->>B: GET /api/client/person/{id}/detail/
    B->>D: JOIN person, cart, product
    D-->>B: Детали клиента
    B-->>F: JSON response

    F->>B: GET /api/client/person/{id}/summary/
    B->>AI: Анализ предпочтений клиента
    AI-->>B: AI инсайты
    B-->>F: AI summary
    F-->>U: Отображение AI анализа

    Note over U,WS: Real-time обновления через WebSocket
```

## Ключевые компоненты системы

### Frontend (Next.js + React)
- **Dashboard**: Главная страница с карточками клиентов
- **Person Management**: Управление клиентами
- **AI Analytics**: AI-анализ клиентов
- **WebSocket Integration**: Реальное время обновления
- **Material-UI**: Компоненты интерфейса

### Backend (Django + DRF)
- **Person API**: CRUD операции с клиентами
- **Statistics API**: Аналитика посещений
- **Cart API**: Управление корзинами
- **WebSocket**: Уведомления в реальном времени
- **AI Integration**: Интеграция с OpenAI

### Database (PostgreSQL + pgvector)
- **User**: Пользователи системы
- **Person**: Клиенты с векторными данными
- **Cart/Product**: Корзины и товары
- **Vector Search**: Поиск по лицам

### AI Services
- **OpenAI API**: Генерация инсайтов о клиентах
- **Facial Recognition**: Распознавание лиц
- **Behavioral Analysis**: Анализ поведения

## ASCII Диаграмма процесса (как в примере)

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                           Nome.ai - Система распознавания лиц                   │
└─────────────────────────────────────────────────────────────────────────────────┘

┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Пользователь  │    │   Frontend      │    │   Backend       │    │   Database      │
│                 │    │   (Next.js)     │    │   (Django)      │    │   (PostgreSQL)  │
└─────────────────┘    └─────────────────┘    └─────────────────┘    └─────────────────┘
         │                        │                        │                        │
         │ 1. Вход в систему      │                        │                        │
         ├───────────────────────►│                        │                        │
         │                        │ 2. Авторизация         │                        │
         │                        ├───────────────────────►│                        │
         │                        │                        │ 3. Проверка User       │
         │                        │                        ├───────────────────────►│
         │                        │                        │                        │
         │ 4. Просмотр дашборда   │                        │                        │
         ├───────────────────────►│                        │                        │
         │                        │ 5. Запрос списка       │                        │
         │                        ├───────────────────────►│                        │
         │                        │                        │ 6. SELECT Person       │
         │                        │                        ├───────────────────────►│
         │                        │                        │                        │
         │ 7. Клик на клиента     │                        │                        │
         ├───────────────────────►│                        │                        │
         │                        │ 8. Детали клиента      │                        │
         │                        ├───────────────────────►│                        │
         │                        │                        │ 9. JOIN с корзинами    │
         │                        │                        ├───────────────────────►│
         │                        │                        │                        │
         │ 10. AI анализ          │                        │                        │
         ├───────────────────────►│                        │                        │
         │                        │ 11. AI Summary         │                        │
         │                        ├───────────────────────►│                        │
         │                        │                        │ 12. OpenAI API         │
         │                        │                        ├───────────────────────►│
         │                        │                        │                        │
         │ 13. WebSocket события  │                        │                        │
         │◄───────────────────────┤                        │                        │
         │                        │◄───────────────────────┤                        │
         │                        │                        │ 14. person_joined      │
         │                        │                        ├───────────────────────►│
         │                        │                        │                        │
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   AI Services   │    │   WebSocket     │    │   Statistics    │    │   Vector Search │
│   (OpenAI)      │    │   (Real-time)   │    │   (Analytics)   │    │   (pgvector)    │
└─────────────────┘    └─────────────────┘    └─────────────────┘    └─────────────────┘
         ▲                        ▲                        ▲                        ▲
         │                        │                        │                        │
         │ 15. AI инсайты         │                        │                        │
         │◄───────────────────────┤                        │                        │
         │                        │                        │                        │
         │                        │ 16. Real-time updates  │                        │
         │                        │◄───────────────────────┤                        │
         │                        │                        │ 17. Статистика         │
         │                        │                        ├───────────────────────►│
         │                        │                        │                        │ 18. Vector поиск
         │                        │                        │                        ├───────────────────────►│
```

## Диаграмма архитектуры системы

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                              Nome.ai Architecture                              │
└─────────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────────┐
│                              CLIENT LAYER                                      │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐           │
│  │ Web Browser │  │ Next.js App │  │ React Comp. │  │ Material-UI │           │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘           │
│         │                 │                 │                 │                │
│         └─────────────────┼─────────────────┼─────────────────┘                │
│                           │                 │                                  │
│  ┌─────────────┐          │                 │          ┌─────────────┐         │
│  │ WebSocket   │◄─────────┼─────────────────┼─────────►│ API Client  │         │
│  │ Client      │          │                 │          │ (useRequest)│         │
│  └─────────────┘          │                 │          └─────────────┘         │
└─────────────────────────────────────────────────────────────────────────────────┘
                                        │
                                        ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                               API LAYER                                        │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐           │
│  │ REST API    │  │ Auth API    │  │ Person API  │  │ Stats API   │           │
│  │ Endpoints   │  │ Endpoints   │  │ Endpoints   │  │ Endpoints   │           │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘           │
│         │                 │                 │                 │                │
│         └─────────────────┼─────────────────┼─────────────────┘                │
│                           │                 │                                  │
│  ┌─────────────┐          │                 │          ┌─────────────┐         │
│  │ WebSocket   │          │                 │          │ Cart API    │         │
│  │ Endpoints   │          │                 │          │ Endpoints   │         │
│  └─────────────┘          │                 │          └─────────────┘         │
└─────────────────────────────────────────────────────────────────────────────────┘
                                        │
                                        ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                            BUSINESS LOGIC LAYER                                │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐           │
│  │ Person      │  │ Vector      │  │ AI Analysis │  │ Statistics  │           │
│  │ Services    │  │ Recognition │  │ Services    │  │ Services    │           │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘           │
│         │                 │                 │                 │                │
│         └─────────────────┼─────────────────┼─────────────────┘                │
│                           │                 │                                  │
│  ┌─────────────┐          │                 │          ┌─────────────┐         │
│  │ Cart        │          │                 │          │ Visit       │         │
│  │ Services    │          │                 │          │ Tracking    │         │
│  └─────────────┘          │                 │          └─────────────┘         │
└─────────────────────────────────────────────────────────────────────────────────┘
                                        │
                                        ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                              DATA LAYER                                        │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐           │
│  │ PostgreSQL  │  │ User Table  │  │ Person      │  │ Cart Table  │           │
│  │ Database    │  │             │  │ Table       │  │             │           │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘           │
│         │                 │                 │                 │                │
│         └─────────────────┼─────────────────┼─────────────────┘                │
│                           │                 │                                  │
│  ┌─────────────┐          │                 │          ┌─────────────┐         │
│  │ pgvector    │          │                 │          │ Product     │         │
│  │ Extension   │          │                 │          │ Table       │         │
│  └─────────────┘          │                 │          └─────────────┘         │
└─────────────────────────────────────────────────────────────────────────────────┘
                                        │
                                        ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                           EXTERNAL SERVICES                                    │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐           │
│  │ OpenAI API  │  │ AI Insights │  │ File        │  │ Image       │           │
│  │             │  │ Generation  │  │ Storage     │  │ Storage     │           │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘           │
└─────────────────────────────────────────────────────────────────────────────────┘
```

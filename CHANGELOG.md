# Changelog

Все значимые изменения в проекте Nome.ai будут документированы в этом файле.

Формат основан на [Keep a Changelog](https://keepachangelog.com/ru/1.0.0/),
и этот проект следует [семантическому версионированию](https://semver.org/lang/ru/).

## [1.1.0] - 2024-10-18

### Добавлено

#### AI Functionality
- ✨ **AI-powered Customer Insights**: Advanced AI integration for generating personalized customer insights
- 🤖 New endpoint `GET /api/client/person/{id}/summary/` for AI-generated customer summaries
- 📊 Automatic analysis of favorite dishes and table preferences
- 🎯 Age categorization system with 8 groups (0-10, 10-18, 18-25, 25-35, 35-45, 45-55, 55-65, 65+)

#### API Endpoints
- 📋 New endpoint `GET /api/client/person/{id}/detail/` for detailed customer information with carts and products
- 🔍 Enhanced order history analysis in `/orders/` endpoint

#### Utilities
- 🛠️ Function `get_age_category()` for age category determination
- 🛠️ Function `get_age_category_name()` for category name localization
- 🤖 Function `_generate_ai_summary()` for AI summary generation

### Improved

#### Functionality
- 🔍 Enhanced customer preference analysis with order frequency tracking
- 📈 Expanded favorite dishes statistics (top 5 instead of top 3)
- 🎯 Added table preference analysis
- ⚡ Optimized database queries with `prefetch_related`

#### Documentation
- 📚 New **AI Features Guide** document (`backend/docs/AI_FEATURES.md`)
- 📝 Updated **API Reference** with new endpoints and examples
- 🚀 Updated **Deployment Guide** with AI API configuration instructions
- 📖 Updated main **README.md** with new features information
- 💡 Added AI feature usage examples in Python and JavaScript
- 🔧 Fixed URL endpoint inconsistencies (`/detail/` instead of `/details/`)

### Configuration

#### Environment Variables
- 🔐 Added `OPENAI_API_KEY` variable for AI integration
- 📝 Updated `.env` file examples in all documents

#### Dependencies
- 📦 Added AI client library for API integration

### Security

- 🔒 Added error handling for missing AI API key
- 🛡️ Implemented graceful fallback for AI API errors
- 🔐 Documented best practices for API key protection

### Documentation

#### New Files
- 📄 `backend/docs/AI_FEATURES.md` - Complete AI features documentation
- 📄 `CHANGELOG.md` - Project change history

#### Updated Files
- 📝 `README.md` - Added AI features information
- 📝 `backend/docs/README.md` - Added Recent Updates section
- 📝 `backend/docs/API_REFERENCE.md` - New endpoints and examples
- 📝 `backend/docs/DEPLOYMENT.md` - AI configuration section
- 📝 `backend/docs/TESTING.md` - No changes (still current)

## [1.0.0] - 2024-10-01

### Added

#### Core Functionality
- 👤 Person management system with vector search
- 🔍 Facial recognition using 128-dimensional vectors
- 📊 Statistics and analytics (visits, gender, age, emotions)
- 🛒 Cart and product management
- 🔐 Authentication and authorization system
- 🏢 Multi-organization support

#### API Endpoints
- `POST /api/client/person/` - Создание/обновление персон
- `PUT /api/client/person/{id}/` - Обновление информации о персоне
- `GET /api/client/persons/` - Список персон с пагинацией
- `GET /api/client/person/{id}/orders/` - История заказов
- `GET /api/client/statistics/*` - Различные статистические эндпоинты
- `POST /api/client/cart-products/bulk/` - Массовое создание товаров в корзине

#### Database
- 🗄️ PostgreSQL with pgvector extension
- 📊 Models: Person, Organization, Cart, Product, CartProduct
- 🔍 Indexes for query optimization

#### Documentation
- 📚 Documentation Hub
- 🔗 API Reference
- 🚀 Deployment Guide
- 🧪 Testing Guide

#### Testing
- ✅ Comprehensive test suite
- 📊 Test coverage > 90%
- 🧪 Integration tests for all endpoints

---

## Change Types

- `Added` - new functionality
- `Changed` - changes in existing functionality
- `Deprecated` - functionality that will be removed soon
- `Removed` - removed functionality
- `Fixed` - bug fixes
- `Security` - security fixes

---

**Nome.ai** - Advanced facial recognition and visitor analytics for modern businesses.


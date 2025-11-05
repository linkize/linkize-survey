#!/bin/bash

echo "🧪 Linkize Survey - Executando Testes Automatizados"
echo "=================================================="

# Verificar se as dependências estão instaladas
if [ ! -d "node_modules" ]; then
  echo "📦 Instalando dependências..."
  npm install
fi

# Função para executar testes unitários
run_unit_tests() {
  echo ""
  echo "🔬 Executando Testes Unitários (Vitest)..."
  echo "----------------------------------------"
  npm run test -- --run
  
  if [ $? -eq 0 ]; then
    echo "✅ Testes unitários passaram!"
  else
    echo "❌ Falha nos testes unitários"
    return 1
  fi
}

# Função para executar testes de cobertura
run_coverage() {
  echo ""
  echo "📊 Gerando Relatório de Cobertura..."
  echo "-----------------------------------"
  npm run test:coverage
  
  echo "📈 Relatório de cobertura gerado em ./coverage/index.html"
}

# Função para executar testes E2E
run_e2e_tests() {
  echo ""
  echo "🌐 Executando Testes E2E (Cypress)..."
  echo "------------------------------------"
  
  # Verificar se o servidor está rodando
  if ! curl -s http://localhost:5174 > /dev/null; then
    echo "🚀 Iniciando servidor de desenvolvimento..."
    npm run dev &
    SERVER_PID=$!
    
    # Aguardar o servidor iniciar
    echo "⏳ Aguardando servidor iniciar..."
    sleep 5
    
    # Verificar se servidor está respondendo
    for i in {1..30}; do
      if curl -s http://localhost:5174 > /dev/null; then
        echo "✅ Servidor iniciado com sucesso!"
        break
      fi
      if [ $i -eq 30 ]; then
        echo "❌ Timeout: Servidor não respondeu"
        kill $SERVER_PID 2>/dev/null
        return 1
      fi
      sleep 1
    done
  else
    echo "✅ Servidor já está rodando"
    SERVER_PID=""
  fi
  
  # Executar testes Cypress
  npm run test:e2e:headless
  E2E_RESULT=$?
  
  # Parar servidor se foi iniciado por este script
  if [ ! -z "$SERVER_PID" ]; then
    echo "🛑 Parando servidor de desenvolvimento..."
    kill $SERVER_PID 2>/dev/null
  fi
  
  if [ $E2E_RESULT -eq 0 ]; then
    echo "✅ Testes E2E passaram!"
  else
    echo "❌ Falha nos testes E2E"
    return 1
  fi
}

# Função para executar todos os testes
run_all_tests() {
  echo "🚀 Executando todos os testes..."
  
  run_unit_tests
  UNIT_RESULT=$?
  
  run_coverage
  
  run_e2e_tests  
  E2E_RESULT=$?
  
  echo ""
  echo "📋 Resumo dos Testes:"
  echo "===================="
  
  if [ $UNIT_RESULT -eq 0 ]; then
    echo "✅ Testes Unitários: PASSOU"
  else
    echo "❌ Testes Unitários: FALHOU"
  fi
  
  if [ $E2E_RESULT -eq 0 ]; then
    echo "✅ Testes E2E: PASSOU"
  else
    echo "❌ Testes E2E: FALHOU"
  fi
  
  if [ $UNIT_RESULT -eq 0 ] && [ $E2E_RESULT -eq 0 ]; then
    echo ""
    echo "🎉 Todos os testes passaram! Projeto pronto para deploy."
    return 0
  else
    echo ""
    echo "❌ Alguns testes falharam. Verifique os logs acima."
    return 1
  fi
}

# Verificar argumentos da linha de comando
case "$1" in
  "unit")
    run_unit_tests
    ;;
  "coverage")
    run_coverage
    ;;
  "e2e")
    run_e2e_tests
    ;;
  "all"|"")
    run_all_tests
    ;;
  *)
    echo "Uso: $0 [unit|coverage|e2e|all]"
    echo ""
    echo "Opções:"
    echo "  unit     - Executa apenas testes unitários"
    echo "  coverage - Gera relatório de cobertura"
    echo "  e2e      - Executa apenas testes E2E"
    echo "  all      - Executa todos os testes (padrão)"
    exit 1
    ;;
esac
import { execSync } from 'child_process'

console.log('🚀 Executando Prisma DB Push...\n')

try {
  // Verifica se as variáveis de ambiente estão configuradas
  if (!process.env.DATABASE_URL) {
    console.error('❌ Erro: DATABASE_URL não está configurada')
    console.log('\nConfigure as variáveis de ambiente:')
    console.log('- DATABASE_URL (connection pooler URL do Supabase)')
    console.log('- DIRECT_URL (direct connection URL do Supabase)')
    process.exit(1)
  }

  console.log('📊 Sincronizando schema com o banco de dados...')
  
  // Executa o push do Prisma
  execSync('npx prisma db push', {
    stdio: 'inherit',
    env: process.env
  })

  console.log('\n✅ Schema sincronizado com sucesso!')
  console.log('\n📝 Próximos passos:')
  console.log('1. Verifique as tabelas criadas no Supabase Dashboard')
  console.log('2. O Prisma Client foi gerado automaticamente')
  console.log('3. Teste a conexão em: /api/health/db')

} catch (error) {
  console.error('\n❌ Erro ao executar prisma db push:')
  console.error(error.message)
  process.exit(1)
}

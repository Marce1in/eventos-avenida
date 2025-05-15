import ChangeUserDataForm from "@/components/changeUserDataForm"

function ProfilePage() {

  return (
    <div className="mx-[15vw] pt-10">
      <h1 className="text-4xl font-bold">Perfil</h1>
      <p className="text-lg text-muted-foreground">Gerencie suas informações pessoais</p>
      <main className="border-border border rounded-xl p-[1.5vw] mt-10">
        <h2 className="text-2xl font-semibold">Informações Pessoais</h2>
        <p className="text-base text-muted-foreground">Atualize seus dados pessoais</p>

        <ChangeUserDataForm />
      </main>

    </div>
  )
}

export default ProfilePage

import { useForm } from "react-hook-form"
import { Input } from "./ui/input"
import { Form, FormControl, FormField, FormItem } from "./ui/form"
import { Button } from "./ui/button"
import { Search } from "lucide-react"
import { Dispatch, SetStateAction } from "react"

function SearchBar({ querySetter }: { querySetter: Dispatch<SetStateAction<string>> }) {
  const form = useForm({
    defaultValues: {
      query: "",
    }
  })

  function onSubmit({ query }: { query: string }) {
    querySetter(query)
  }

  return (
    <>
      <Form {...form}>
        <form
          className="flex"
          onSubmit={form.handleSubmit(onSubmit)}
        >

          <FormField
            control={form.control}
            name="query"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input className="rounded-r-none" placeholder="pesquisar" {...field} />
                </FormControl>
              </FormItem>
            )}
          />

          <Button
            className="rounded-l-none border-border"
            type="submit"
          >
            <Search />
          </Button>

        </form>
      </Form>
    </>
  )
}

export default SearchBar

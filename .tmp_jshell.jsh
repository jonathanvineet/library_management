var env = java.nio.file.Files.readString(java.nio.file.Path.of(".env"));
String host=null,port=null,db=null,user=null,pwd=null;
for (String line : env.split("\\R")) {
  if (line.startsWith("SUPABASE_DB_HOST=")) host = line.substring("SUPABASE_DB_HOST=".length());
  if (line.startsWith("SUPABASE_DB_PORT=")) port = line.substring("SUPABASE_DB_PORT=".length());
  if (line.startsWith("SUPABASE_DB_NAME=")) db = line.substring("SUPABASE_DB_NAME=".length());
  if (line.startsWith("SUPABASE_DB_USERNAME=")) user = line.substring("SUPABASE_DB_USERNAME=".length());
  if (line.startsWith("SUPABASE_DB_PASSWORD=")) pwd = line.substring("SUPABASE_DB_PASSWORD=".length());
}
var url = "jdbc:postgresql://"+host+":"+port+"/"+db;
Class.forName("org.postgresql.Driver");
try (var c = java.sql.DriverManager.getConnection(url, user, pwd);
     var ps = c.prepareStatement("select column_name, data_type from information_schema.columns where table_schema='public' and table_name='book_requests' order by ordinal_position");
     var rs = ps.executeQuery()) {
  while (rs.next()) {
    System.out.println(rs.getString(1)+"|"+rs.getString(2));
  }
}
/exit
